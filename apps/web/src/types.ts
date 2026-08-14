export type Destination =
  | "overview"
  | "lab"
  | "backtest"
  | "simulation"
  | "risk"
  | "data"
  | "runs"
  | "settings";

export type ExecutionQueueStatus = "待风控" | "已提交" | "部分成交" | "已完成" | "已拒绝";
export type ExecutionStatusFilter = "全部" | ExecutionQueueStatus;
export type RiskEventState = "预警" | "阻断" | "模拟强平" | "已解决";
export type RiskAlertFilter = RiskEventState;
export type RunStatusFilter = "全部" | "运行中" | "已完成" | "警告" | "失败";
export type DataDiagnostic = "data-quality" | "delayed-minute-data";

export interface RunProvenance {
  runId: string;
  strategyVersion: string;
  dataVersion: string;
  timestamp: string;
}

export type DataQualityGate =
  | { state: "ready"; delaySeconds: number; missingBuckets: 0 }
  | {
      state: "blocked";
      delaySeconds: number;
      missingBuckets: number;
      reason: string;
      repairAction: string;
    };

export interface ActionFeedback {
  kind: "success" | "warning" | "error";
  message: string;
  runId?: string;
}

export interface LocalSnapshot {
  valuedAt: string;
  source: "local-prototype";
}

export interface RiskEventReadModel extends RunProvenance {
  state: RiskEventState;
  code: string;
  summary: string;
  impact: string;
}

export interface DataVersionReadModel {
  versionId: string;
  createdAt: string;
  changeSummary: string;
  qualityResult: string;
  isCurrent: boolean;
}

export interface RunRecordReadModel extends RunProvenance {
  task: string;
  status: Exclude<RunStatusFilter, "全部"> | "已完成";
  elapsed: string;
}

export interface ConfigurationVersionReadModel {
  versionId: string;
  effectiveAt: string;
  scope: string;
  oldValue: string;
  newValue: string;
}

export interface GlobalOperationsStatus {
  tradingDate: string;
  marketTimestamp: string;
  freshnessSeconds: number;
  paperAccountId: string;
  riskAlertCount: number;
  runState: "运行中" | "已暂停";
}

export interface DestinationStateByDestination {
  overview: undefined;
  lab: undefined;
  backtest: undefined;
  simulation: { executionStatus: ExecutionQueueStatus } | undefined;
  risk: { alertFilter?: RiskAlertFilter; runId?: string } | undefined;
  data: { diagnostic: DataDiagnostic } | undefined;
  runs: { runId?: string; status?: RunStatusFilter } | undefined;
  settings: undefined;
}

export type NavigationState<T extends Destination> = DestinationStateByDestination[T];
export type Navigate = <T extends Destination>(to: T, state?: NavigationState<T>) => void;

export type ActiveNavigation = {
  [T in Destination]: { destination: T; state: NavigationState<T> };
}[Destination];
