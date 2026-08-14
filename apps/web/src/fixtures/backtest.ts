export const backtestRuns = [
  { id: "run_bt_8f2c1a", label: "沪深300动量轮动 · v0.3.2", date: "2025-01-01 — 2026-08-14", return: "+18.42%", sharpe: "1.48", data: "cn-day-v20260814.2", status: "已完成" },
  { id: "run_bt_6a97b4", label: "红利低波防御 · v0.2.8", date: "2025-01-01 — 2026-08-14", return: "+12.10%", sharpe: "1.12", data: "cn-day-v20260813.1", status: "已完成" },
  { id: "run_bt_b39e18", label: "行业均值回归 · v0.1.9", date: "2025-07-01 — 2026-08-14", return: "--", sharpe: "--", data: "cn-min-v20260814.2", status: "运行中" },
  { id: "run_bt_d1e7c4", label: "质量因子精选 · v0.4.1", date: "2025-01-01 — 2026-08-14", return: "+14.08%", sharpe: "1.26", data: "cn-day-v20260814.2", status: "已完成" },
  { id: "run_bt_e2f8d5", label: "趋势突破 · v0.2.4", date: "2025-01-01 — 2026-08-14", return: "+9.64%", sharpe: "0.98", data: "cn-day-v20260814.2", status: "已完成" }
] as const;

export const backtestMetrics = [
  ["年化收益", "+18.42%", "可追溯至 run_bt_8f2c1a"], ["波动率", "12.46%", "日收益标准差年化"], ["夏普", "1.48", "无风险利率 2.10%"], ["最大回撤", "-8.24%", "2025-04-18 — 2025-05-22"],
  ["胜率", "56.80%", "交易级别"], ["换手", "184.20%", "双边成交额 / 净资产"], ["交易成本占比", "14.62%", "成本 ¥18,420.30"], ["融资利息", "¥0.00", "信用参数未启用"], ["融券费用", "¥0.00", "信用参数未启用"], ["强平次数", "0", "模拟风控事件"]
] as const;

export const trades = [
  { time: "2026-08-14 09:42:11", symbol: "600519.SH", side: "买入", quantity: "100", price: "¥1,703.80", contribution: "+¥420.00" },
  { time: "2026-08-13 13:18:04", symbol: "300750.SZ", side: "卖出", quantity: "200", price: "¥318.20", contribution: "+¥1,140.00" },
  { time: "2026-08-12 10:05:19", symbol: "601318.SH", side: "买入", quantity: "300", price: "¥48.32", contribution: "-¥210.00" }
] as const;
