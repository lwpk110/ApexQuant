## Context

应用已具有共享控制室壳层与四个已实现路由；其余四个目的地仍由 `App.tsx` 输出占位页。OD 项目已经提供风险、数据、运行记录和设置的页面基线，SRS 对字段、危险确认、版本不可变性和错误恢复定义了明确合同。

## Goals / Non-Goals

**Goals:**

- 使用替换式 typed local read model 完成四个路由和跨页 handoff。
- 保持 OD 的深色、紧凑、表格优先的视觉合同，同时补全冻结 SRS 字段。
- 对危险、版本化和数据质量状态使用局部受控交互，保留完整运行、版本和审计标识。

**Non-Goals:**

- 真实券商、行情、账户、文件导出、系统通知、数据同步或剪贴板写入。
- URL 路由器和服务端持久化；URL 状态仅作为下一阶段的接口契约。

## Decisions

### Route-local read models with typed handoff

每页有专属 fixture 和明确类型；`App` 只保存目的地和受限导航状态。这样可在未来以 DTO adapter 替换 fixture，避免把原型状态扩散为全局无类型对象。采用全局 store 会在不存在持久化边界时增加耦合，故不采用。

### Confirmation and version state remain local

风险强平、限额保存和设置保存均先显示影响、时间和新 ID，再以本地反馈更新原型视图。该策略保证危险动作不会伪装为真实执行，同时满足可审计交互合同。

### Explicit data and run provenance

数据版本、配置版本和运行 ID 是所有列表/详情/跨页入口的一等字段。版本创建不得替换旧 fixture 记录；重跑和同步均创建新 ID。仅靠成功 toast 被拒绝，因为无法测试重现性。

### Test-first and OD-aligned visual verification

每个场景先在对应页面测试中建立失败断言，再最小实现。视觉审核复用现有 OD 项目页面、三种视口和无横向溢出检查；值可因 SRS 补全而不同，布局和状态语义不得漂移。

## Risks / Trade-offs

- [原型值被误认为真实结果] → 页面和 fixture 明确为模拟/本地快照，禁止网络副作用。
- [四页各自复制手势和样式] → 复用既有 panel、table、notice、confirmation、badge 和 shell 类。
- [跨页状态丢失] → 对 alert、diagnostic、run ID、过滤器建立联合类型和组件测试。
- [OD 导出服务不可用] → 使用本地浏览器渲染、控制台错误和几何检查作为比较证据。
