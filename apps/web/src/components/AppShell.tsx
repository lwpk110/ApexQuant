import { AlertTriangle, Database, FlaskConical, Gauge, LineChart, PlaySquare, ScrollText, Settings, ShieldCheck } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import type { Destination, Navigate } from "../types";
import { StatusBadge } from "./StatusBadge";
import { getHealth } from "../api";

const navigation = [
  ["overview", "总览", Gauge], ["lab", "策略实验室", FlaskConical], ["backtest", "回测中心", LineChart], ["simulation", "模拟执行", PlaySquare],
  ["risk", "账户与风险", ShieldCheck], ["data", "数据中心", Database], ["runs", "运行记录", ScrollText], ["settings", "设置", Settings]
] as const;

export function AppShell({ current, onNavigate, children }: { current: Destination; onNavigate: Navigate; children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [searchFeedback, setSearchFeedback] = useState("");
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  useEffect(() => {
    getHealth().then(() => setBackendOnline(true)).catch(() => setBackendOnline(false));
  }, []);
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedQuery = query.trim();
    setSearchFeedback(normalizedQuery ? `已提交搜索：${normalizedQuery}` : "请输入策略、标的或运行 ID");
  };

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">AQ</span><span>ApexQuant</span></div>
      <nav aria-label="主导航">
        {navigation.map(([id, label, Icon]) => <button key={id} aria-label={label} className={`nav-item ${current === id ? "nav-item--active" : ""}`} aria-current={current === id ? "page" : undefined} onClick={() => onNavigate(id)}><Icon size={17} /><span>{label}</span>{id === "risk" && <b>3</b>}</button>)}
      </nav>
      <div className="sidebar-footer"><StatusBadge tone="positive">数据源 12 秒</StatusBadge><span>模拟环境 · 未连接真实柜台</span></div>
    </aside>
    <section className="main-area">
      <header className="topbar">
        <StatusBadge tone="positive">交易日 2026-08-14</StatusBadge>
        <span className="topbar-detail">行情 09:42:18 CST</span><span className="topbar-detail">新鲜度 12 秒</span>
        <span className="topbar-detail topbar-account">模拟账户 · AQ-PAPER-001</span>
        <form className="search" onSubmit={submitSearch}><label><span className="sr-only">全局搜索</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索策略、标的或运行 ID" /></label><span className="search-feedback" role="status">{searchFeedback}</span></form>
        <button className="alert-button" aria-label="3 条风险告警" onClick={() => onNavigate("risk", { alertFilter: "预警" })}><AlertTriangle size={16} /><b>3</b></button>
        <StatusBadge tone={backendOnline === false ? "warning" : "positive"}>{backendOnline === false ? "后端未连接" : "运行中"}</StatusBadge>
      </header>
      <main className="workspace">{children}</main>
    </section>
  </div>;
}
