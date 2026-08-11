由于模型无法直接生成外部 Web 文件的 HTTP 下载链接，上一版排版报错是因为“代码块嵌套”导致的渲染异常。

以下为您重新按标准 Markdown 结构直接排版的 **PRD 完整全文**，您可以点击右上角的复制按钮一次性复制并保存为 `PRD_QuantTrader_Pro.md` 文件：

---

# QuantTrader-Pro（A 股个人量化交易平台）产品需求文档 (PRD)

| 文档版本 | 修订日期 | 作者 | 状态 | 适用柜台 |
| --- | --- | --- | --- | --- |
| v1.0.0 | 2026-08-10 | Quant Lead | Approved | 迅投 MiniQMT (xtquant) / PTrade |

---

## 1. 产品概述与核心目标 (Product Overview)

### 1.1 产品定位

面向独立开发者与个人量化交易者的轻量级、高可用、低延迟 A 股量化交易平台。系统贯穿“高频行情订阅 - 策略因子计算 - 事前风控过滤 - 智能拆单执行 - 柜台异步回报 - 实时多通道告警”全链路。

### 1.2 核心解决痛点

* **克服情绪化交易**：通过严格的机器纪律替代人工盘中决策。
* **规避 A 股交易陷阱**：内置 T+1 规则、涨跌停锁死、集合竞价限制及碎股处理算法，防止无效申报与资金冻结。
* **低成本高可靠执行**：基于开源与本地 API（MiniQMT），实现零额外昂贵硬件依赖下的毫秒级风控与交易执行。

---

## 2. 系统整体架构与数据流 (Architecture & Dataflow)

```
 [数据中心 (Data Pipe)] ────────> [事件总线 (EventEngine)] <───────── [UI / 监视看板]
 (Sina/AkShare/Tushare)                     │                           ▲
                                           ▼                           │
                                   [策略引擎 (Strategy)]               │ (异步日志/状态)
                                           │ (产出交易信号)              │
                                           ▼                           │
                                   [事前风控网关 (RiskGate)]            │
                                           │ (风控通过)                │
                                           ▼                           │
 [QMT/xtquant API] <──────────────> [执行引擎 (SOR/TWAP)] ──────────────┘
 (券商实盘/模拟柜台)   (成交回报/订单状态)

```

---

## 3. 核心功能模块需求规范

### 3.1 数据中心 (Data Pipe Engine)

* **实时行情 (Real-time Market Data)**：
* **主数据源**：新浪 / 东方财富 HTTP 异步高频轮询（500ms - 1s），获取 Tick 级及买卖五档盘口。
* **实盘行情**：适配 MiniQMT `xtquant.subscribe_quote` 接口，订阅 L1 快照及 1m/5m K 线。


* **盘后数据同步 (Post-market ETL)**：
* 每日 15:30 自动调用 AkShare / BaoStock 下载全市场 `OHLCV`、除权息复权因子（前/后复权）、财务指标。
* 持久化存储至 **DuckDB** 或 **ClickHouse** 列式数据库。



### 3.2 策略引擎与生命周期 (Strategy Engine)

策略继承标准基类 `CtaTemplate`，严格遵守以下生命周期：

```python
class BaseStrategy:
    def on_init(self): pass        # 初始化因子与历史指标缓存
    def on_start(self): pass       # 启动策略，订阅实时行情
    def on_tick(self, tick): pass  # Tick 驱动信号计算
    def on_bar(self, bar): pass    # Bar 驱动信号计算
    def on_order(self, order): pass# 订单状态变动异步回调
    def on_trade(self, trade): pass# 成交回报异步回调
    def on_stop(self): pass        # 策略安全下线，清理挂单

```

### 3.3 事前风控网关 (Pre-trade Risk Gate)

任何策略发出的买卖请求必须通过风控拦截网关校验，防范系统性风险：

| 风控检查项 | 判定条件 | 动作与处理机制 |
| --- | --- | --- |
| **单票仓位上限** | （单股拟持仓市值 + 现有市值）/ 总资产 $> 20\%$ | 拦截买单，输出 `[RISK_REJECT]` 日志，允许平仓卖单。 |
| **手数量向下取整** | 拟买入股数未对齐 100 股 | 强行向下取整：`math.floor(vol / 100) * 100`。 |
| **流控保护 (Rate Limit)** | 单秒请求 $> 5$ 笔 或 单分 $> 30$ 笔 | 进入队列延迟排队，防止触发柜台封禁。 |
| **自成交拦截 (Self-Match)** | 同股票存在同向/反向未成交挂单 | 强制触发先撤后挂（Cancel-First-Then-Order）。 |
| **价格偏离度校验** | $\left\Vert{} \frac{\text{委托价} - \text{最新价}}{\text{最新价}} \right\Vert{} > 2.0\%$ | 拒单，防范流体算法因盘口异常导致高价追高。 |

### 3.4 智能执行算法 (Smart Order Routing)

* **动态 TWAP 分拆**：大单在设定时间窗口 $T$ 内拆分派发，单笔挂单添加 $\pm 15\%$ 随机噪点，避开量化特征识别。
* **超时追单与撤单**：限价单超过 $N$ 秒未成交自动发送撤单，若策略信号依然存在，按最新“买一价/卖一价”重新追单。

---

## 4. A 股微观结构与边缘场景处理

### 4.1 结算规则与 T+1 持仓状态机

系统独立维护账户持仓数据模型，解决买入冻结与可用持仓隔离问题：

$$\text{Total\_Shares (总持仓)} = \text{Available\_Shares (可用持仓)} + \text{Frozen\_Shares (T+1买入/挂单冻结)}$$

* **T 日买入成功**：`Total_Shares += N`，`Frozen_Shares += N`，`Available_Shares` 不变。
* **T+1 日开盘前**：`Available_Shares = Total_Shares`，`Frozen_Shares = 0`。

### 4.2 特殊盘口与交易机制

1. **集合竞价（09:15 - 09:25）**：
* 09:20 - 09:25 属于不可撤单阶段，系统在此期间封锁任何撤单 API 调用。


2. **涨跌停板处理**：
* **涨停板**：最新价 $\ge$ 涨停价 且 卖一量 $= 0$ 时，禁止生成买单，避免资金无效冻结。
* **跌停板**：卖出单自动转换为跌停价申买/卖或触发抢跑保护。


3. **零股（碎股）处理**：
* 持仓因送转股产生非 100 整数倍（如 150 股）时，平仓卖出时允许且**必须一次性全额申报卖出**。


4. **断网重启与本地/柜台自动对账 (Reconciliation)**：
* 系统启动时调用 `xtquant.query_credit_detail()` 获取实际柜台持仓与未成交单。
* 比对本地 DB，若存在差异，强制**以柜台返回结果作为绝对事实**覆盖本地内存，并向报警管道发送差异报告。



---

## 5. UI/UX 界面设计规范

界面采用 **PySide6** 制作，采用高密度四宫格交互布局：

```
+----------------------------------------------------------------------------------------------------+
| 状态栏: [柜台: 已连接 (MiniQMT)] [行情: 已连接 (Sina)] [CPU: 3.8%] [内存: 380MB] [DB: OK]             |
+----------------------------------------------------------------------------------------------------+
| [资产总览]  总资产: ¥1,250,000 | 可用资金: ¥450,000 | 持仓市值: ¥800,000 | 今日盈亏: +¥12,400 (+1.01%)     |
+---------------------------------------+------------------------------------------------------------+
| [策略监控表 (Strategy Table)]          | [持仓与实时订单面板 (Positions & Active Orders)]             |
| 策略名称     | 状态  | 今日收益 | 操作 | 代码   | 股票名称 | 持仓/可用  | 成本价  | 现价   | 盈亏(%) |
| DualThresh  | 运行中| +1.8%   | [停] | 600519 | 贵州茅台 | 200 / 200  | 1680.00| 1712.50| +1.93%  |
| AlphaFactor | 已暂停| -0.2%   | [启] | 300750 | 宁德时代 | 500 / 0    | 182.00 | 179.80 | -1.21%  |
+---------------------------------------+------------------------------------------------------------+
| [实时日志与风控记录 (Logs & Alerts)]                                                                |
| [10:15:32][INFO] 策略 DualThresh 触发买入信号: 600519 目标股数 100                                   |
| [10:15:32][RISK] [PASS] 风控校验通过: 单票仓位 13.7% < 限制 20.0%                                   |
| [10:15:33][TRADE] [SUCCESS] 柜台成交: 600519 买入 100股 价格: 1712.00 成交编号: #94012               |
+----------------------------------------------------------------------------------------------------+

```

---

## 6. 数据库表结构设计 (Schema Design)

采用 **SQLite / DuckDB** 存储关系与状态，表定义如下：

```sql
-- 1. 策略配置与状态表
CREATE TABLE strategy_config (
    strategy_id VARCHAR(32) PRIMARY KEY,
    strategy_name VARCHAR(64) NOT NULL,
    status VARCHAR(16) NOT NULL, -- RUNNING, PAUSED, ERROR
    parameters JSON NOT NULL,    -- 运行时参数 (止损线、VWAP窗口等)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 订单交易记录表
CREATE TABLE orders (
    order_id VARCHAR(64) PRIMARY KEY,
    strategy_id VARCHAR(32) NOT NULL,
    symbol VARCHAR(16) NOT NULL,
    side VARCHAR(8) NOT NULL,    -- BUY, SELL
    price DOUBLE NOT NULL,
    quantity INT NOT NULL,
    status VARCHAR(16) NOT NULL,  -- SUBMITTED, FILLED, CANCELLED, REJECTED
    created_time TIMESTAMP NOT NULL,
    updated_time TIMESTAMP NOT NULL
);

-- 3. 持仓对账快照表
CREATE TABLE position_snapshots (
    snapshot_date DATE NOT NULL,
    symbol VARCHAR(16) NOT NULL,
    total_shares INT NOT NULL,
    available_shares INT NOT NULL,
    avg_cost DOUBLE NOT NULL,
    PRIMARY KEY (snapshot_date, symbol)
);

```

---

## 7. 实施路线图 (Implementation Roadmap)

1. **Sprint 1 (第 1-2 周) - 核心基础设施构建**：
* 搭建事件驱动总线 `EventEngine`。
* 完成 AkShare / Sina 行情数据管道建立及 DuckDB 存储集成。


2. **Sprint 2 (第 3-4 周) - 交易与风控引擎对接**：
* 对接 MiniQMT `xtquant` 模拟环境。
* 实现 T+1 状态机、100 股向下取整、事前风控网关逻辑。


3. **Sprint 3 (第 5-6 周) - UI 界面与策略落地**：
* 基于 PySide6 完成可视化看板构建。
* 编写并测试 TWAP 分拆算法及基础双均线/VWAP 策略。


4. **Sprint 4 (第 7 周) - 对账实测与告警通知上线**：
* 接入飞书/钉钉 Webhook 告警系统。
* 开展模拟盘连续 5 天无干预自动跑通，验证崩溃对账恢复逻辑。
