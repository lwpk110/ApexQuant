import { useEffect, useState } from "react";
import { RefreshCw, ArrowUpRight } from "lucide-react";
import { getOverview, type OverviewResponse } from "../api";
import type { Navigate } from "../types";

export function OverviewPage({ onNavigate }: { onNavigate: Navigate }) {
  const [data, setData] = useState<OverviewResponse | null>(null); const [error, setError] = useState("");
  const load = () => { setError(""); getOverview().then(value => { if (!value?.market?.quote) throw new Error("API 返回的总览数据不完整"); setData(value); }).catch(e => setError(e instanceof Error ? e.message : "总览数据不可用")); };
  useEffect(load, []);
  if (!data && !error) return <div className="panel panel-body"><h1>总览</h1><p>正在从后端加载真实行情...</p></div>;
  if (error) return <div className="panel panel-body"><h1>总览</h1><p role="alert">后端数据不可用：{error}</p><button className="button" onClick={load}><RefreshCw size={15}/>重试</button></div>;
  const market = data!.market; const q = market.quote;
  return <div className="overview-page"><div className="page-heading"><div><p className="eyebrow">COMMAND CENTER · API READ MODEL</p><h1>总览</h1><p>真实公共行情与模拟账户状态</p></div><button className="button" onClick={load}><RefreshCw size={15}/>刷新</button></div>
    <div className={`notice ${market.stale ? "notice--warning" : ""}`}><strong>{market.stale ? "行情已降级" : "行情正常"}</strong><span>来源 {market.source} · {market.fetchedAt ? new Date(market.fetchedAt).toLocaleString("zh-CN") : "未抓取"} · 真实券商关闭</span></div>
    <section className="metric-strip metric-strip--dense"><div className="metric"><span>{market.symbol} 最新价</span><strong>{q.price.toFixed(2)} {q.currency}</strong><small className={q.change >= 0 ? "positive" : "negative"}>{q.change >= 0 ? "+" : ""}{q.change.toFixed(2)} ({q.changePercent.toFixed(2)}%)</small></div><div className="metric"><span>模拟净资产</span><strong>¥{data!.account.netAsset}</strong><small>后端模拟账本</small></div><div className="metric"><span>可用现金</span><strong>¥{data!.account.availableCash}</strong><small>不可用于真实交易</small></div><div className="metric"><span>运行状态</span><strong>就绪</strong><small>{data!.activeRuns.length} 个活动运行</small></div></section>
    <section className="panel"><div className="section-heading"><h2>市场数据</h2><button className="text-button" onClick={() => onNavigate("data")}>打开数据中心 <ArrowUpRight size={14}/></button></div><p>质量状态：{String(market.quality.state)} · 数据由后端抓取并缓存，研究用途。</p></section>
  </div>;
}
