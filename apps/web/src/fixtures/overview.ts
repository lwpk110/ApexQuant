export const healthChecks = [
  { label: "数据源", detail: "分钟数据延迟 12 秒", tone: "positive" },
  { label: "交易日历", detail: "2026-08-14 已确认", tone: "positive" },
  { label: "模拟时钟", detail: "09:42:18 运行中", tone: "positive" },
  { label: "任务队列", detail: "2 项待处理，最长 18 秒", tone: "warning" },
  { label: "数据库", detail: "本地账本已同步 09:42:16", tone: "positive" },
  { label: "最近错误", detail: "1 个待复核", tone: "negative" }
] as const;

export const accountMetrics = [
  { label: "净资产", value: "¥1,248,460.32", detail: "估值 09:42:16" },
  { label: "可用资金", value: "¥434,980.76", detail: "占净资产 34.84%" },
  { label: "持仓市值", value: "¥813,479.56", detail: "6 个标的" },
  { label: "融资负债", value: "¥0.00", detail: "信用参数未启用" },
  { label: "融券负债", value: "¥0.00", detail: "信用参数未启用" },
  { label: "总杠杆", value: "1.42x / 2.00x", detail: "风险限额" },
  { label: "维持担保比例", value: "312.46%", detail: "模拟账户口径" },
  { label: "今日收益", value: "+¥3,686.32", detail: "+0.30%", positive: true }
] as const;

export const riskMetrics = [
  { label: "单票市值集中度", value: "18.60% / 20.00%", tone: "warning" },
  { label: "行业集中度", value: "28.40% / 35.00%", tone: "neutral" },
  { label: "最大回撤", value: "4.36% / 8.00%", tone: "neutral" },
  { label: "当日亏损", value: "0.84% / 3.00%", tone: "neutral" }
] as const;

export const executionQueue = [
  { status: "待风控", count: 3, tone: "warning" },
  { status: "已提交", count: 5, tone: "neutral" },
  { status: "部分成交", count: 1, tone: "warning" },
  { status: "已完成", count: 18, tone: "positive" },
  { status: "已拒绝", count: 2, tone: "negative" }
] as const;

export const strategies = [
  { name: "沪深300动量轮动", version: "v0.3.2", data: "cn-min-v20260814.2", status: "可模拟", cycle: "5 分钟", signals: "4", turnover: "8.4%", pnl: "+¥2,840.22", run: "run_sim_8f2c1a" },
  { name: "红利低波防御", version: "v0.2.8", data: "cn-day-v20260813.1", status: "已暂停", cycle: "日频", signals: "0", turnover: "0.0%", pnl: "+¥846.10", run: "run_sim_6a97b4" },
  { name: "行业均值回归", version: "v0.1.9", data: "cn-min-v20260814.2", status: "待验证", cycle: "1 分钟", signals: "--", turnover: "--", pnl: "--", run: "run_val_b39e18" }
] as const;

export const auditEvents = [
  { time: "09:42:20", type: "手动操作", summary: "值班员确认风险告警仍处于观察状态", runId: "run_sim_8f2c1a" },
  { time: "09:42:19", type: "数据问题", summary: "分钟行情快照完成完整性核对，无缺失桶", runId: "run_sim_8f2c1a" },
  { time: "09:42:14", type: "成交", summary: "600519.SH 买入 100 股，成交价 ¥1,703.80", runId: "run_sim_8f2c1a" },
  { time: "09:42:13", type: "委托", summary: "600519.SH 买入 100 股委托已提交模拟撮合", runId: "run_sim_8f2c1a" },
  { time: "09:42:12", type: "风控判定", summary: "单票仓位 18.60%，通过 SRS-BR-RISK-001", runId: "run_sim_8f2c1a" },
  { time: "09:42:11", type: "信号", summary: "沪深300动量轮动生成加仓信号", runId: "run_sim_8f2c1a" }
] as const;

export const overviewAnalytics = {
  "净值": { headline: "¥1,248,460.32", change: "+6.84%", detail: "组合净值", path: "M0 146 L30 139 L60 143 L90 126 L120 132 L150 118 L180 123 L210 100 L240 110 L270 95 L300 102 L330 88 L360 94 L390 70 L420 79 L450 60 L480 67 L510 45 L540 53 L570 34 L610 40 L640 21" },
  "基准": { headline: "沪深300 4,128.56", change: "+4.12%", detail: "基准收益", path: "M0 148 L30 142 L60 145 L90 136 L120 139 L150 126 L180 131 L210 116 L240 121 L270 110 L300 116 L330 102 L360 108 L390 91 L420 97 L450 80 L480 85 L510 70 L540 74 L570 60 L610 64 L640 52" },
  "回撤": { headline: "最大回撤 -4.36%", change: "较限额 3.64%", detail: "回撤幅度", path: "M0 48 L30 55 L60 52 L90 72 L120 68 L150 88 L180 84 L210 108 L240 100 L270 126 L300 119 L330 112 L360 128 L390 112 L420 102 L450 94 L480 83 L510 75 L540 63 L570 56 L610 47 L640 38" },
  "杠杆": { headline: "当前总杠杆 1.42x", change: "限额 2.00x", detail: "总杠杆", path: "M0 112 L30 108 L60 114 L90 101 L120 98 L150 106 L180 92 L210 96 L240 82 L270 90 L300 78 L330 83 L360 75 L390 81 L420 69 L450 74 L480 65 L510 70 L540 59 L570 64 L610 56 L640 60" },
  "行业暴露": { headline: "行业集中度 28.40%", change: "限额 35.00%", detail: "最大行业暴露", path: "M0 98 L30 91 L60 104 L90 94 L120 86 L150 101 L180 89 L210 80 L240 95 L270 83 L300 75 L330 90 L360 78 L390 68 L420 82 L450 73 L480 62 L510 76 L540 66 L570 55 L610 63 L640 49" }
} as const;

export type OverviewAnalyticsView = keyof typeof overviewAnalytics;
