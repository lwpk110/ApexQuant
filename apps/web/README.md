# ApexQuant Web 控制室

这里是 0.0.1 Web 控制室的入口目录。页面实现必须遵循 `DESIGN.md`、`UI-DESIGN.md` 和 `SRS-0.0.1.md`，并通过应用层 API 访问数据。

页面入口固定为：`overview`、`lab`、`backtest`、`simulation`、`risk`、`data`、`runs`、`settings`。总览、数据中心和运行记录在运行时直接读取后端 API；后端不可用时显示错误状态，不以 fixture 替代真实行情。

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

前端默认请求 `http://127.0.0.1:8000/api`；可通过 `VITE_API_BASE_URL` 覆盖。API 不可用时页面显示“后端未连接”及重试入口。

完整使用手册见 [../../docs/MVP-USAGE.md](../../docs/MVP-USAGE.md)。测试覆盖健康条、风险限额、执行队列导航、危险确认、API 客户端和固定侧栏布局。
