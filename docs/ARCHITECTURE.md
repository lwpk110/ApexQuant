# ApexQuant 工程脚手架

## 目标

本脚手架对应 0.0.1 需求基线，先提供可测试的领域规则和应用服务边界，再逐步接入数据、回测、模拟执行和 UI。当前版本只允许研究、回测和模拟执行，不连接真实券商，不发送真实委托。

## 目录

```text
src/apexquant/
  domain/          业务实体、状态和纯规则
  application/    用例服务，编排领域规则与端口
  adapters/        数据库、行情、文件等基础设施适配器
  interfaces/      CLI、HTTP/API 和未来 Web UI 入口
tests/             单元测试与验收测试
apps/web/          前端应用预留目录
docs/              工程设计、运行手册和 ADR
```

## 依赖方向

`interfaces -> application -> domain`。`adapters` 只实现应用层定义的端口，不在领域层导入数据库、网络或 UI 框架。这样订单风控可在无行情供应商、无数据库的环境中独立验证。

## 当前可运行能力

- `RiskGate`：执行最小交易单位、碎股平仓、行情新鲜度、价格偏离和单票仓位门禁。
- `PaperExecutionService`：生成模拟订单 ID，并返回带规则 ID 的风控决定。
- `apexquant doctor`：检查脚手架版本、时区和真实柜台开关。

## 后续实现顺序

1. 持久化 `Run`、`AuditEvent`、`ConfigVersion` 和数据版本。
2. 增加数据质量检查与版本化同步任务。
3. 增加回测运行器和可复现结果快照。
4. 增加模拟执行状态机、T+1 和记账。
5. 按 `UI-DESIGN.md` 实现 8 个页面，并复用同一 API 契约。

## 端口约定

`application/ports.py` 定义账户快照、行情、审计和模拟订单的最小协议。适配器实现不得把供应商字段直接泄漏到页面；先转换为 SRS 中的 `AccountSnapshot`、`MarketSnapshot`、`Order` 和 `AuditEvent` 契约。
