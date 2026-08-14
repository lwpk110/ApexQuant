# SDD 追踪矩阵

状态含义：`Spec-only` = 只有规格；`Red` = 已有失败测试；`Green` = 测试和构建通过；`Visual-pending` = 缺原型截图/视觉证据；`Verified` = 全部证据齐全。

| 模块 | SDD | SRS 范围 | 测试文件 | 实现文件 | 当前状态 |
| --- | --- | --- | --- | --- | --- |
| 总览 | `SDD-OVERVIEW-0.0.1` | `SRS-FR-OV-001..010` | `OverviewPage.test.tsx`, `styles.contract.test.ts` | `OverviewPage.tsx`, `AppShell.tsx` | Green / Visual-reviewed |
| 策略实验室 | `SDD-LAB-0.0.1` | `SRS-FR-LAB-001..008` | `StrategyLabPage.test.tsx` | `StrategyLabPage.tsx`, `fixtures/lab.ts` | Green / Visual-reviewed |
| 回测中心 | `SDD-BT-0.0.1` | `SRS-FR-BT-001..007` | `BacktestPage.test.tsx` | `BacktestPage.tsx` | Green / Visual-reviewed |
| 模拟执行 | `SDD-SIM-0.0.1` | `SRS-FR-SIM-001..008` | `SimulationPage.test.tsx` | `SimulationPage.tsx` | Green / Visual-reviewed |

## OpenSpec 场景证据

变更：`openspec/changes/implement-control-room-prototype`（`spec-driven`）。每次新增行为先在对应组件测试中形成失败断言，再以局部绿灯、全量测试及 TypeScript/Vite 构建验证。

| 能力与 OpenSpec 场景 | 组件测试证据 | 最近绿灯证据 | 未决依赖 |
| --- | --- | --- | --- |
| 壳层：八目的地、具体状态、搜索、风险/队列交接 | `apps/web/src/pages/OverviewPage.test.tsx`：主导航、全局状态、搜索、风险与队列交接 | `pnpm test`：37 passed；`pnpm build`：passed（2026-08-14）；浏览器 1440px/1180px/390px 已复核（2026-08-14） | 原型节点与截图视觉差异 |
| 总览：账户/风险、只读对账、预运行预览、分析、审计 | `OverviewPage.test.tsx`：账户字段、确认暂停、对账、预览、五类分析、六类审计 | 同上 | 原型节点与截图视觉差异 |
| 策略实验室：配置溯源、泄漏/样本外/数据质量门禁、复制隔离、分析视图 | `StrategyLabPage.test.tsx`：配置、门禁、草稿、复制、实验、运行记录和四分析视图 | 同上 | 原型节点与截图视觉差异 |
| 回测：可复现快照、指标贡献、交易溯源、版本安全比较 | `BacktestPage.test.tsx`：单页配置、快照锁定、复制运行 ID、贡献详情、交易字段、四项上限、混合版本禁绘 | `pnpm test`：52 passed；`pnpm build`：passed | 原型节点与截图视觉差异 |
| 模拟执行：快照溯源、四组合筛选、空态恢复、风险、暂停恢复、审计链 | `SimulationPage.test.tsx`：信号快照、四筛选、数据中心、90 秒门禁、模拟暂停、安全操作、事件顺序 | `pnpm test`：52 passed；`pnpm build`：passed | 原型节点与截图视觉差异 |
| 账户与风险：账户/T+1、市值闭合、限额、风险事件、模拟强平 | `RiskPage.test.tsx`：字段、闭合、筛选、版本预览、精确确认 | `RiskPage.tsx`；47 tests passed；build passed | OD 风险页基线 + SRS 溯源补全 |
| 数据中心：数据集、时区、质量诊断、同步与版本历史 | `DataPage.test.tsx`：质量、诊断、同步生命周期、版本保留 | `DataPage.tsx`；47 tests passed；build passed | OD 数据页基线 + 不可变版本语义 |
| 运行记录：摘要、筛选、失败恢复、重跑和审计 | `RunsPage.test.tsx`：4 scenarios；导出、行级操作、结构化失败详情、来源 run ID | `pnpm test`：52 passed；`pnpm build`：passed | OD runs 页基线 + 新 run provenance |
| 设置：规则、费用、模拟默认值、保护、通知、版本保存/撤销 | `SettingsPage.test.tsx`：2 scenarios；47 tests passed | `SettingsPage.tsx`；build passed | OD settings 页基线 + 配置版本语义 |

## 命令记录

- 红灯：对每个新增场景先执行 `pnpm test -- <Page>.test.tsx`，由缺失行为断言失败确认缺口。
- 组件绿灯：`pnpm test -- OverviewPage.test.tsx`、`pnpm test -- StrategyLabPage.test.tsx`、`pnpm test -- BacktestPage.test.tsx`、`pnpm test -- SimulationPage.test.tsx`。
- 样式红绿：`pnpm test -- styles.contract.test.ts`，先验证 1180px 提前压缩为红灯，再将桌面侧栏断点调整为 1024px 后通过。
- 全量验证：`pnpm test`，最近结果为 9 files / 52 tests passed（2026-08-14）。
- 构建验证：`pnpm build`，执行 `tsc -b && vite build` 并通过。

页面当前标记为 `Visual-reviewed`：OD 项目、入口、原型截图和本地浏览器差异已核对，详见 `PROTOTYPE-INPUTS.md` 与 `PROTOTYPE-DIFF.md`。`Verified` 仍保留给未来 API/端口契约替换或临时 fixture 边界获批准后的整体验收。

2026-08-14 浏览器验收：本地 Vite 服务 `http://localhost:4173/` 在 1440px、1180px 与 390px 下完成八目的地导航；根文档无水平溢出、控制台错误为 0。风险、数据、运行记录与设置的状态交接和版本/危险确认均已实际交互检查。

2026-08-14 合同加固：新增数据集类型/缺失桶/状态、同步取消与日志、风险总杠杆限额、设置完整费用/默认值/平仓撤单保护；对应页面测试仍为 47/47，通过生产构建和三视口八页验收。OpenSpec 变更 `2026-08-14-harden-control-room-contracts` 已归档并同步主规格。

2026-08-14 表格交互加固：OpenSpec 变更 `2026-08-14-restore-prototype-table-interactions` 已归档并同步主规格，覆盖数据/运行记录导出与行级上下文、回测快照锁定和模拟暂停反馈；全量 52 tests、构建及 390px/1440px 浏览器检查通过。

## 门禁

页面只有在以下条件全部满足后才能标记 `Verified`：

- 完整 SDD 已评审；
- SRS、SDD、测试、代码逐条可追踪；
- TDD 红灯和绿灯均有命令记录；
- TypeScript 构建通过；
- 1440px、1180px、移动端行为通过；
- 原型节点和截图已完成视觉核对；
- fixture 已替换为 API/端口契约，或临时边界已批准。
