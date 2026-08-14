import { useMemo, useState } from "react";
import { Activity, Ban, CheckCircle2, CirclePause, Clock3, Database, Play, RotateCcw, XCircle } from "lucide-react";
import { simulationOrders, simulationSignals, simulationTimeline } from "../fixtures/simulation";
import { StatusBadge } from "../components/StatusBadge";
import type { ExecutionQueueStatus, ExecutionStatusFilter, Navigate } from "../types";

type Quality = "健康" | "行情延迟 128 秒";

type SimulationPageProps = {
  initialQuality?: Quality;
  initialStatus?: ExecutionQueueStatus;
  onNavigate?: Navigate;
};

const riskLines = [
  { label: "集中度", value: "18.60% / 20.00%", tone: "warning" as const },
  { label: "总杠杆", value: "1.42x / 2.00x" },
  { label: "当日亏损", value: "0.84% / 3.00%" },
  { label: "保证金", value: "¥112,640.00 / ¥350,000.00" },
  { label: "可卖数量", value: "600519.SH · 200 股" },
  { label: "涨跌停检查", value: "3 / 3 通过" },
  { label: "融资/融券额度", value: "融资未启用 / 融券未启用" },
  { label: "最近拒绝原因", value: "价格偏离 2.31%", tone: "negative" as const }
] as const;

export function SimulationPage({ initialQuality = "健康", initialStatus, onNavigate }: SimulationPageProps) {
  const [quality, setQuality] = useState<Quality>(initialQuality);
  const [strategy, setStrategy] = useState("全部");
  const [symbol, setSymbol] = useState("全部");
  const [status, setStatus] = useState<ExecutionStatusFilter>(initialStatus ?? "全部");
  const [side, setSide] = useState("全部");
  const [selectedSnapshot, setSelectedSnapshot] = useState<(typeof simulationSignals)[number] | null>(null);
  const [paused, setPaused] = useState(initialQuality !== "健康");
  const [feedback, setFeedback] = useState("");
  const blocked = quality !== "健康";

  const orders = useMemo(
    () => simulationOrders.filter(order =>
      (strategy === "全部" || order.strategy === strategy)
      && (symbol === "全部" || order.symbol === symbol)
      && (status === "全部" || order.status === status)
      && (side === "全部" || order.side === side)
    ),
    [strategy, symbol, status, side]
  );

  const clearFilters = () => {
    setStrategy("全部");
    setSymbol("全部");
    setStatus("全部");
    setSide("全部");
  };
  const resume = () => {
    if (blocked) return;
    setPaused(false);
    setFeedback("模拟执行已恢复 · 已重新检查行情延迟与缺失桶");
  };

  return <div className="simulation-page">
    <div className="page-heading">
      <div>
        <p className="eyebrow">PAPER EXECUTION · INTRADAY CONTROL</p>
        <h1>模拟执行</h1>
        <p>按时间顺序查看信号、风控、委托、成交和记账</p>
      </div>
      <div className="heading-actions">
        <button className="button button--default" onClick={() => { setPaused(true); setFeedback("新开仓已暂停；平仓、撤单和风险处理仍可执行"); }}><CirclePause size={15} />暂停开仓</button>
        <button className="button button--primary" disabled={blocked || !paused} onClick={resume}><Play size={15} />恢复执行</button>
      </div>
    </div>

    {feedback && <div className="notice notice--positive" role="status"><CheckCircle2 size={16} /><span>{feedback}</span></div>}

    {paused && !blocked && <div className="notice notice--warning" aria-label="模拟暂停"><CirclePause size={16} /><span><strong>模拟暂停</strong> · 新开仓已暂停，平仓、撤单和风险处理仍可执行。</span></div>}

    {blocked && <div className="notice notice--warning">
      <Ban size={16} />
      <span><strong>数据门禁未通过 · {quality}</strong> · 新开仓已阻断。平仓、撤单和风险处理仍可执行。<button className="text-button" onClick={() => setQuality("健康")}>模拟修复数据质量</button></span>
    </div>}

    <section className="panel sim-clock">
      <div><span className="section-kicker">SIMULATION CLOCK</span><strong>09:42:18</strong><span>CST · 2026-08-14</span></div>
      <div><span>行情时间</span><b>09:42:06</b><StatusBadge tone={blocked ? "warning" : "positive"}>{quality}</StatusBadge></div>
      <div><span>当前批次</span><code>batch_20260814_0942</code></div>
      <div><span>待风控</span><b className="warning">3</b></div>
      <div><span>部分成交</span><b>1</b></div>
    </section>

    <div className="sim-layout">
      <div className="sim-main">
        <section className="panel signal-panel" aria-label="策略信号流">
          <div className="section-heading"><div><span className="section-kicker">STRATEGY SIGNALS</span><h2>策略信号流</h2></div><StatusBadge tone="positive">2 条新信号</StatusBadge></div>
          <div className="signal-cards">
            {simulationSignals.map(signal => <article className="signal-card" key={signal.snapshot}>
              <div className="signal-card-head"><StatusBadge tone="positive">{signal.strategy}</StatusBadge><time>{signal.time}</time></div>
              <div className="signal-card-symbol"><strong>{signal.symbol}</strong><b>目标仓位 {signal.weight}</b></div>
              <p>{signal.reason}</p>
              <a href={`#${signal.snapshot}`} onClick={event => { event.preventDefault(); setSelectedSnapshot(signal); }}><Database size={13} />数据快照 {signal.snapshot}</a>
            </article>)}
          </div>
        </section>

        <section className="panel orders-panel">
          <div className="section-heading">
            <div><span className="section-kicker">ORDERS</span><h2>委托与成交</h2></div>
            <div className="filter-row">
              <select aria-label="策略筛选" value={strategy} onChange={event => setStrategy(event.target.value)}><option value="全部">全部策略</option><option>沪深300动量轮动</option><option>红利低波防御</option></select>
              <select aria-label="标的筛选" value={symbol} onChange={event => setSymbol(event.target.value)}><option>全部</option><option>600519.SH</option><option>300750.SZ</option><option>601318.SH</option></select>
              <select aria-label="状态筛选" value={status} onChange={event => setStatus(event.target.value as ExecutionStatusFilter)}><option>全部</option><option>待风控</option><option>已提交</option><option>部分成交</option><option>已完成</option><option>已拒绝</option></select>
              <select aria-label="方向筛选" value={side} onChange={event => setSide(event.target.value)}><option>全部</option><option>买入</option><option>卖出</option></select>
            </div>
          </div>
          {orders.length === 0 ? <div className="empty-state">
            <XCircle size={20} /><strong>没有符合当前筛选的委托</strong><span>调整策略、标的、状态或方向筛选后重试。</span>
          <div className="empty-state-actions"><button className="button button--default" onClick={clearFilters}>清除筛选</button><button className="button button--default" onClick={() => onNavigate?.("data", { diagnostic: "data-quality" })}>前往数据中心</button></div>
          </div> : <div className="table-wrap"><table>
            <thead><tr><th>标的</th><th>策略</th><th>方向</th><th className="numeric">委托数量</th><th className="numeric">剩余数量</th><th className="numeric">价格</th><th>状态</th><th>时间</th></tr></thead>
            <tbody>{orders.map(order => <tr key={order.symbol + order.time}>
              <td><strong>{order.symbol}</strong></td><td>{order.strategy}</td><td className={order.side === "买入" ? "positive" : "negative"}>{order.side}</td><td className="numeric">{order.quantity} 股</td><td className="numeric">{order.remaining === "0" ? "--" : <span className="warning">剩余 {order.remaining} 股</span>}</td><td className="numeric">{order.price}</td><td><StatusBadge tone={order.status === "已完成" ? "positive" : order.status === "已拒绝" ? "negative" : "warning"}>{order.status}</StatusBadge></td><td><code>{order.time}</code></td>
            </tr>)}</tbody>
          </table></div>}
        </section>

        <section className="panel timeline-panel">
          <div className="section-heading"><div><span className="section-kicker">AUDIT CHAIN · run_sim_8f2c1a</span><h2>执行链路</h2></div><button className="text-button" onClick={() => onNavigate?.("runs", { runId: "run_sim_8f2c1a" })}>打开完整运行记录 <RotateCcw size={14} /></button></div>
          <ol className="execution-timeline">{simulationTimeline.map(([type, time, summary], index) => <li key={type}><span className={`event-icon event-${index}`}>{index === 0 ? <Activity size={13} /> : index === 1 ? <ShieldIcon /> : index === 2 ? <Play size={12} /> : index === 3 ? <CheckCircle2 size={13} /> : <Database size={13} />}</span><div><header><StatusBadge tone={index === 1 ? "positive" : "neutral"}><span className="event-type">{type}</span></StatusBadge><time>{time}</time></header><p>{summary}</p></div></li>)}</ol>
        </section>
      </div>

      <aside className="sim-sidebar">
        <section className="panel sim-risk"><div className="section-heading"><div><span className="section-kicker">EXECUTION RISK</span><h2>执行风险</h2></div><Clock3 size={17} /></div><div className="sim-risk-list">{riskLines.map(line => <RiskLine key={line.label} {...line} />)}</div></section>
        <section className="panel sim-actions"><div className="section-heading"><div><span className="section-kicker">SAFE ACTIONS</span><h2>可用操作</h2></div></div><button className="safe-action" aria-label="平仓处理"><XCircle size={15} />平仓处理 <span>可用</span></button><button className="safe-action" aria-label="撤销委托"><XCircle size={15} />撤销委托 <span>3 笔</span></button><button className="safe-action" aria-label="风险处理"><CheckCircle2 size={15} />风险处理 <span>可用</span></button><button className="safe-action"><RotateCcw size={15} />重新对账 <span>09:42:16</span></button></section>
      </aside>
    </div>

    {selectedSnapshot && <div className="modal-backdrop" role="presentation"><section className="confirmation" role="dialog" aria-modal="true" aria-labelledby="snapshot-title"><button className="icon-button close" aria-label="关闭数据快照详情" onClick={() => setSelectedSnapshot(null)}>×</button><span className="section-kicker">DATA SNAPSHOT</span><h2 id="snapshot-title">数据快照详情</h2><dl><div><dt>策略版本</dt><dd>{selectedSnapshot.strategy} · {selectedSnapshot.strategyVersion}</dd></div><div><dt>数据版本</dt><dd><code>{selectedSnapshot.dataVersion}</code></dd></div><div><dt>运行 ID</dt><dd><code>{selectedSnapshot.runId}</code></dd></div><div><dt>信号生成时间</dt><dd>{selectedSnapshot.time} CST</dd></div></dl><div className="confirmation-actions"><button className="button button--default" onClick={() => setSelectedSnapshot(null)}>关闭</button><button className="button button--primary" onClick={() => onNavigate?.("runs", { runId: selectedSnapshot.runId })}>打开完整审计链路</button></div></section></div>}
  </div>;
}

function RiskLine({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "warning" | "negative" }) {
  return <div className="risk-line"><span>{label}</span><strong className={`tone-${tone}`}>{value}</strong></div>;
}

function ShieldIcon() {
  return <span className="shield-icon">✓</span>;
}
