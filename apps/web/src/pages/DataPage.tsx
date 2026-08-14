import { useState } from "react";
import type { DataDiagnostic } from "../types";

const rows = [
  { dataset: "CN-A-1m", type: "分钟行情", source: "新浪", coverage: "2025-01-01 — 2026-08-12", updated: "09:40:03 CST", missingRate: "0.04%", missingBuckets: "2", adjustment: "前复权", license: "个人研究使用", status: "延迟 2 分钟" },
  { dataset: "CN-A-1d", type: "日线行情", source: "AkShare", coverage: "2016-01-01 — 2026-08-11", updated: "08-11 15:42 CST", missingRate: "0.00%", missingBuckets: "0", adjustment: "前 / 后复权", license: "个人研究使用", status: "健康" },
  { dataset: "CN-CALENDAR", type: "交易日历", source: "BaoStock", coverage: "2016-01-01 — 2027-12-31", updated: "08-12 08:30 CST", missingRate: "0.00%", missingBuckets: "0", adjustment: "不适用", license: "公开数据", status: "健康" },
  { dataset: "CN-FACTOR", type: "复权因子", source: "AkShare", coverage: "2016-01-01 — 2026-08-11", updated: "08-11 15:51 CST", missingRate: "0.00%", missingBuckets: "0", adjustment: "已校验", license: "个人研究使用", status: "健康" }
];

export function DataPage({ diagnostic }: { diagnostic?: DataDiagnostic }) {
  const [syncing, setSyncing] = useState(false);
  const [syncState, setSyncState] = useState<"待运行" | "运行中" | "已取消">("待运行");
  const [current, setCurrent] = useState("CN-A-1m v2026.08");
  const [feedback, setFeedback] = useState("");
  const [columnsOpen, setColumnsOpen] = useState(false);
  const start = () => { setSyncing(true); setSyncState("运行中"); setFeedback(""); };
  const cancel = () => { setSyncing(false); setSyncState("已取消"); setFeedback("同步已取消 · 未创建新数据版本"); };
  const finish = () => { setSyncing(false); setSyncState("待运行"); setCurrent("CN-A-1m v2026.08.12.1"); setFeedback("本地同步已完成 · 新版本已通过质量检查"); };
  const showLog = () => setFeedback("同步日志：下载缺失分钟桶 2/2 · 连续性检查通过");
  return <>
    <div className="page-heading"><div><p className="eyebrow">DATA CENTER · LOCAL PROTOTYPE SNAPSHOT</p><h1>数据中心</h1><p>所有时间使用 Asia/Shanghai（CST）；旧版本保持可读、可引用。</p></div><div className="heading-actions"><button className="button button--primary" onClick={start} disabled={syncing}>开始同步</button></div></div>
    {feedback && <div className="notice" role="status"><span>{feedback}</span></div>}
    {diagnostic && <div className="notice"><strong>分钟数据诊断</strong><span>延迟 2 分钟 · 缺失 2 个分钟桶 · 影响分钟策略验证和模拟入口。</span><button className="text-button" onClick={() => setFeedback("诊断入口已打开 · 关联 CN-A-1m 缺失分钟桶")}>打开诊断</button></div>}
    <section className="panel"><div className="section-heading"><div><span className="section-kicker">DATASETS · ASIA/SHANGHAI</span><h2>数据集清单</h2></div><div className="heading-actions"><span className="muted">当前版本 {current}</span><button className="button" onClick={() => setColumnsOpen(value => !value)}>列显隐</button><button className="button" onClick={() => setFeedback("已准备数据集 CSV 导出 · 本地原型不写入文件")}>导出 CSV</button></div></div>{columnsOpen && <div className="notice"><span>列显隐：数据集、类型、来源、覆盖区间、最后更新、缺失率、缺失桶数、复权状态、许可证 / 限制、状态</span></div>}<div className="table-wrap"><table><thead><tr>{["数据集", "类型", "来源", "覆盖区间", "最后更新", "缺失率", "缺失桶数", "复权状态", "许可证 / 限制", "状态", "操作"].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.dataset}><td><strong>{row.dataset}</strong><small>{row.type}</small></td><td>{row.type}</td><td>{row.source}</td><td>{row.coverage}</td><td>{row.updated}</td><td>{row.missingRate}</td><td>{row.missingBuckets}</td><td>{row.adjustment}</td><td>{row.license}</td><td>{row.status}</td><td><button className="text-button" onClick={() => setFeedback(`${row.dataset} 诊断入口已打开`)}>{row.dataset === "CN-A-1m" ? "诊断" : "查看"}</button></td></tr>)}</tbody></table></div></section>
    <section className="two-column"><section className="panel"><div className="section-heading"><div><span className="section-kicker">QUALITY CHECKS</span><h2>质量检查</h2></div><span className="muted">最近校验 09:41:02 CST</span></div><div className="queue-list">{[["时间连续性", "2 个分钟桶缺失"], ["OHLC 合法性", "已通过"], ["涨跌停价格", "已通过"], ["复权因子跳变", "已通过"]].map(([label, value]) => <div className="queue-item" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section><section className="panel"><div className="section-heading"><div><span className="section-kicker">SYNC TASK</span><h2>同步任务</h2></div><span className="muted">{syncState}</span></div><div className="panel-body"><p>{syncing ? "下载缺失分钟桶" : syncState === "已取消" ? "同步已取消" : "等待同步并校验"}</p><div className="progress-row"><i><em style={{ width: syncing ? "60%" : syncState === "已取消" ? "20%" : "0%" }} /></i><b>{syncing ? "60%" : syncState === "已取消" ? "20%" : "0%"}</b></div><p className="muted">已耗时 {syncing ? "00:00:04" : "00:00:00"}</p><div className="heading-actions">{syncing && <><button className="button button--danger" onClick={cancel}>取消同步</button><button className="button" onClick={showLog}>查看同步日志</button><button className="button button--primary" onClick={finish}>完成本地同步</button></>}</div></div></section></section>
    <section className="panel"><div className="section-heading"><div><span className="section-kicker">VERSION HISTORY</span><h2>版本历史</h2></div></div><div className="queue-list"><div className="queue-item"><code>{current}</code><span>质量检查通过</span><span>当前版本</span></div><div className="queue-item"><code>CN-A-1m v2026.08</code><span>缺失 2 个分钟桶</span><span>旧版本可读</span></div></div></section>
  </>;
}
