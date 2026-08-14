export interface StrategyConfigurationReadModel {
  strategyId: string;
  strategyVersion: string;
  stockUniverse: string;
  cadence: string;
  dateRange: { start: string; end: string };
  adjustmentMode: string;
  factors: readonly string[];
  modelVersion: string;
  parameters: readonly string[];
  singleNameLimit: string;
  transactionCostModel: string;
  latestValidationRunId: string;
  dataVersion: string;
  lifecycle: "已验证，可模拟";
}

export const selectedLabConfiguration: StrategyConfigurationReadModel = {
  strategyId: "strategy_momentum",
  strategyVersion: "strategy_momentum_v0.3.2",
  stockUniverse: "沪深300",
  cadence: "5 分钟",
  dateRange: { start: "2025-01-01", end: "2026-08-14" },
  adjustmentMode: "前复权",
  factors: ["20 日动量", "行业相对强度", "波动率过滤"],
  modelVersion: "model_20260814.3",
  parameters: ["持有标的数 20", "调仓阈值 0.30", "持有期 5 日"],
  singleNameLimit: "20.00%",
  transactionCostModel: "A股模拟默认 v1.2",
  latestValidationRunId: "run_val_43af20",
  dataVersion: "cn-min-v20260814.2",
  lifecycle: "已验证，可模拟"
};

export const labStrategies = [
  { name: "沪深300动量轮动", status: "可模拟", return: "+6.84%", experiment: "exp_20260814_012", updated: "09:38:12", favorite: true },
  { name: "红利低波防御", status: "已暂停", return: "+2.18%", experiment: "exp_20260813_009", updated: "昨日 15:02", favorite: false },
  { name: "行业均值回归", status: "待验证", return: "--", experiment: "尚未运行", updated: "草稿", favorite: false }
] as const;

export const labChecks = [
  { label: "数据泄漏检查", status: "通过", detail: "run_val_43af20 · 09:36:02", tone: "positive" },
  { label: "样本外评估", status: "通过", detail: "2026-07-01 — 2026-08-14", tone: "positive" },
  { label: "数据质量", status: "延迟 12 秒", detail: "缺失桶 0 · 可用于分钟模拟", tone: "positive" }
] as const;

export const labSignals = [
  { symbol: "600519.SH", reason: "20 日动量排名进入前 10%", weight: "18.60%", time: "09:42:11" },
  { symbol: "300750.SZ", reason: "行业相对强度反转", weight: "12.00%", time: "09:37:11" },
  { symbol: "601318.SH", reason: "波动率过滤通过", weight: "8.50%", time: "09:32:11" }
] as const;
