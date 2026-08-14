export const simulationOrders = [
  { symbol: "600519.SH", strategy: "沪深300动量轮动", side: "买入", quantity: "100", remaining: "0", price: "¥1,703.80", status: "已完成", time: "09:42:14" },
  { symbol: "300750.SZ", strategy: "沪深300动量轮动", side: "卖出", quantity: "500", remaining: "300", price: "¥318.20", status: "部分成交", time: "09:41:52" },
  { symbol: "601318.SH", strategy: "红利低波防御", side: "买入", quantity: "300", remaining: "300", price: "¥48.32", status: "已拒绝", time: "09:40:03" }
] as const;

export const simulationSignals = [
  { strategy: "沪深300动量轮动", strategyVersion: "v0.3.2", dataVersion: "cn-min-v20260814.2", runId: "run_sim_8f2c1a", symbol: "600519.SH", reason: "20 日动量排名进入前 10%", weight: "18.60%", time: "09:42:11", snapshot: "snap_20260814_094211" },
  { strategy: "沪深300动量轮动", strategyVersion: "v0.3.2", dataVersion: "cn-min-v20260814.2", runId: "run_sim_8f2c1a", symbol: "300750.SZ", reason: "行业相对强度反转", weight: "12.00%", time: "09:41:49", snapshot: "snap_20260814_094149" }
] as const;

export const simulationTimeline = [
  ["信号", "09:42:11", "沪深300动量轮动生成 600519.SH 加仓信号"],
  ["风控判定", "09:42:12", "单票仓位 18.60% / 20.00%，检查通过"],
  ["委托", "09:42:12", "提交买入 100 股，限价 ¥1,703.80"],
  ["成交", "09:42:14", "成交 100 股，成交价 ¥1,703.80"],
  ["记账", "09:42:16", "模拟账本已更新，T+1 冻结 100 股"]
] as const;
