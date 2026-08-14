# Web 应用预留

这里是 0.0.1 Web 控制室的入口目录。页面实现必须遵循 `DESIGN.md`、`UI-DESIGN.md` 和 `SRS-0.0.1.md`，并通过应用层 API 访问数据。

首批页面入口固定为：`overview`、`lab`、`backtest`、`simulation`、`risk`、`data`、`runs`、`settings`。当前目录不包含演示静态数据；页面开始实现后，在此补充前端包管理配置和运行命令。

## 本地运行

```powershell
pnpm install
pnpm dev -- --host 127.0.0.1 --port 4173
pnpm test
pnpm build
```

另开一个终端启动本地 MVP API：

```powershell
cd ..\..
$env:PYTHONPATH = "src"
python -m apexquant.interfaces.http --host 127.0.0.1 --port 8000
```

前端默认请求 `http://127.0.0.1:8000/api`；可通过 `VITE_API_BASE_URL` 覆盖。API 不可用时页面保留本地 fixture，并显示“后端未连接”。

首个实现切片是总览页。测试先验证健康条、风险限额、执行队列导航、危险确认和固定侧栏布局，再由组件实现通过。
