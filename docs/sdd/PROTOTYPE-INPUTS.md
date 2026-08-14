# 原型输入与偏差记录

## 设计真源

- 需求字段和验收：`REQUIREMENTS-0.0.1.md`、`SRS-0.0.1.md`
- 设计 token 和交互规范：`DESIGN.md`
- 页面信息架构：`UI-DESIGN.md`
- 目标原型：Open Design 项目「ApexQuant 原型设计」

## 当前状态

截至 2026-08-14，Open Design 项目「ApexQuant 原型设计」已作为视觉真源接入。项目 ID 为 `154dfb98-841a-4441-9936-deb453e64e06`，源文件位于 `D:\workspace\github\open-design\.od\projects\154dfb98-841a-4441-9936-deb453e64e06`。

- 总览：`apexquant-prototype.html`、`apexquant-polished.png`
- 策略实验室：`apexquant-strategy-lab.html`
- 回测中心：`apexquant-backtest.html`
- 模拟执行：`apexquant-simulation.html`
- 共享视觉与交互：`apexquant-shared.css`、`apexquant-shared.js`

OD 已按冻结的 SRS/OpenSpec 更新共享资源。其渲染导出服务当前不可用，因此 OD 运行本身不构成像素级验收；本项目以本地浏览器在相同视口下渲染源原型与应用的截图和差异记录作为视觉验收证据。

## 临时处理

四个已开发页面以 OD 页面与共享资源为输入，视觉状态标记为 `Prototype-comparison recorded`。本次比较已记录：

1. OD 项目 ID 与四个页面入口；
2. 原型总览在 1440px 的本地浏览器渲染，及应用在 1440px、1180px、390px 的渲染；
3. 全局壳层、面板、指标、表格和状态语义的逐项差异，见 `PROTOTYPE-DIFF.md`；
4. 受控差异：应用补齐 SRS/OpenSpec 的字段、门禁和溯源信息，原型数据仍仅为演示快照。

本次没有生成 OD 图像导出文件，截图证据由 Codex In-app Browser 的本地渲染会话提供。OD 页面加载无控制台错误；应用八个目的地在 1440px、1180px、390px 均无控制台错误、无根文档横向溢出。导航区域可横向滚动以保留八个入口。

## 禁止事项

- 不得把 fixture 数值当作真实运行结果；
- 不得把临时 CSS 几何值当作原型精确规格；
- 不得在没有原型证据时把页面状态标为 `Verified`。
