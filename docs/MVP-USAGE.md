# ApexQuant MVP 使用手册

本文说明如何在本机启动并验证一期 MVP。当前版本只用于研究、回测和模拟执行，所有状态保存在内存中；不会连接真实券商，也不会发送真实委托。

## 1. 环境要求

- Python 3.11 或更高版本
- Node.js 20 或更高版本
- pnpm 9 或更高版本

Windows PowerShell 可先确认版本：

```powershell
python --version
node --version
pnpm --version
```

## 2. 安装依赖

在仓库根目录执行：

```powershell
python -m pip install -e ".[dev]"
cd apps\web
pnpm install
cd ..\..
```

如果 `python` 未加入 PATH，请使用本机 Python 3.11 的完整路径替换 `python`。

## 3. 启动前后端

打开两个 PowerShell 窗口，并都位于仓库根目录。

终端 A：启动后端 API：

```powershell
$env:PYTHONPATH = "src"
python -m apexquant.interfaces.http --host 127.0.0.1 --port 8000
```

看到 `ApexQuant API listening on ...:8000` 后，API 已启动。

终端 B：启动前端：

```powershell
cd apps\web
pnpm dev -- --host 127.0.0.1 --port 4173
```

浏览器打开 <http://127.0.0.1:4173>。前端默认请求 `http://127.0.0.1:8000/api`，也可以通过环境变量覆盖：

```powershell
$env:VITE_API_BASE_URL = "http://127.0.0.1:8000"
pnpm dev -- --host 127.0.0.1 --port 4173
```

## 4. MVP 使用路径

1. 打开“总览”，确认顶部显示“运行中”，并查看系统健康、风险限额和执行队列。
2. 进入“回测中心”，确认策略版本、数据版本、日期和初始资金，点击“运行回测”。成功时会出现后端生成的 `run_...` 运行 ID。
3. 进入“运行记录”，使用运行 ID 回看任务和审计信息。当前页面仍有本地演示记录，后端运行状态以 API 返回为准。
4. 进入“数据中心”，查看数据质量和版本历史；一期 API 对未知数据集返回空历史，不返回 HTML 错误页。
5. 进入“模拟执行”，验证信号、风控和委托链路。真实柜台始终关闭。

## 5. API 快速检查

健康检查：

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/health
```

提交一次可复现回测：

```powershell
$body = @{
  strategyVersion = "strategy_momentum_v0.3.2"
  dataVersion = "cn-day-v20260814.2"
  costModelVersion = "cost-v1.2"
  randomSeed = 20260814
  startDate = "2025-01-01"
  endDate = "2026-08-14"
  initialCapital = "1000000.00"
  deterministicReturn = "0.1842"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://127.0.0.1:8000/api/backtests `
  -Method Post -ContentType "application/json" -Body $body
```

当前 API 端点：

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| GET | `/api/health` | 服务状态、时区、真实柜台开关 |
| GET | `/api/overview` | 总览健康、账户摘要和运行摘要 |
| GET | `/api/data/versions?datasetId=...` | 数据版本当前值和历史 |
| POST | `/api/backtests` | 创建可复现回测并返回 run ID/指标 |

成功响应使用 `{ "data": ... }`；失败响应使用 `{ "error": { "code", "message" } }`。

## 6. 验证命令

后端：

```powershell
$env:PYTHONPATH = "src"
python -m unittest discover -s tests -v
python -m apexquant.interfaces.cli doctor --json
```

前端：

```powershell
cd apps\web
pnpm test -- --run
pnpm build
```

## 7. 常见问题

### 页面显示“后端未连接”

确认终端 A 仍在运行，并检查：

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/health
```

如果 API 使用其他端口，设置 `VITE_API_BASE_URL` 后重启 Vite。

### 8000 或 4173 端口被占用

换用其他端口，并同步修改 API 基地址：

```powershell
python -m apexquant.interfaces.http --port 8001
$env:VITE_API_BASE_URL = "http://127.0.0.1:8001"
pnpm dev -- --port 4174
```

### 回测失败

检查日期结束值不早于开始值、初始资金为正数，并确认请求包含策略、数据、成本模型和随机种子。错误详情会通过 `error.code` 和 `error.message` 返回。

### 关闭服务

在对应终端按 `Ctrl+C`。MVP 数据保存在进程内，服务重启后运行记录和数据版本会重置。
