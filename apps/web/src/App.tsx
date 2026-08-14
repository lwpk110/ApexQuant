import { useState } from "react";
import { AppShell } from "./components/AppShell";
import { OverviewPage } from "./pages/OverviewPage";
import { StrategyLabPage } from "./pages/StrategyLabPage";
import { BacktestPage } from "./pages/BacktestPage";
import { SimulationPage } from "./pages/SimulationPage";
import { RiskPage } from "./pages/RiskPage";
import { DataPage } from "./pages/DataPage";
import { RunsPage } from "./pages/RunsPage";
import { SettingsPage } from "./pages/SettingsPage";
import type { ActiveNavigation, Destination, Navigate, NavigationState } from "./types";

const labels: Record<Exclude<Destination, "overview">, string> = { lab: "策略实验室", backtest: "回测中心", simulation: "模拟执行", risk: "账户与风险", data: "数据中心", runs: "运行记录", settings: "设置" };

export default function App() {
  const [destination, setDestination] = useState<Destination>("overview");
  const [navigationState, setNavigationState] = useState<ActiveNavigation>({ destination: "overview", state: undefined });
  const navigate: Navigate = <T extends Destination>(to: T, state?: NavigationState<T>) => {
    setDestination(to);
    setNavigationState({ destination: to, state } as ActiveNavigation);
  };
  const simulationStatus = navigationState.destination === "simulation" ? navigationState.state?.executionStatus : undefined;
  const destinationFeedback = navigationState.destination === "risk"
    ? navigationState.state?.alertFilter
    : navigationState.destination === "data"
      ? navigationState.state?.diagnostic
      : navigationState.destination === "runs"
        ? navigationState.state?.runId
        : undefined;
  return <AppShell current={destination} onNavigate={navigate}>{destination === "overview" ? <OverviewPage onNavigate={navigate} /> : destination === "lab" ? <StrategyLabPage onNavigate={navigate} /> : destination === "backtest" ? <BacktestPage /> : destination === "simulation" ? <SimulationPage initialStatus={simulationStatus} onNavigate={navigate} /> : destination === "risk" ? <RiskPage initialAlertFilter={navigationState.destination === "risk" ? navigationState.state?.alertFilter : undefined} onNavigate={navigate} /> : destination === "data" ? <DataPage diagnostic={navigationState.destination === "data" ? navigationState.state?.diagnostic : undefined} /> : destination === "runs" ? <RunsPage initialRunId={navigationState.destination === "runs" ? navigationState.state?.runId : undefined} initialStatus={navigationState.destination === "runs" ? navigationState.state?.status : undefined} /> : <SettingsPage />}</AppShell>;
}
