import { useState } from "react";
import type { RunStatusFilter } from "../types";

const tasks = [
  { id: "RUN-240812-091", task: "模拟执行", strategy: "DualThresh", status: "已完成", time: "09:42:14", elapsed: "00:00:04", action: "回放链路" },
  { id: "RUN-240812-088", task: "分钟数据同步", strategy: "不适用", status: "警告", time: "09:40:03", elapsed: "00:02:15", action: "打开诊断" },
  { id: "RUN-240812-085", task: "策略验证", strategy: "VWAP-MeanRev", status: "失败", time: "09:05:41", elapsed: "00:00:12", action: "查看错误" },
  { id: "BT-240812-116", task: "历史回测", strategy: "DualThresh", status: "已完成", time: "08:56:20", elapsed: "00:01:42", action: "查看结果" }
];
const audit = [["09:42:18","记账","持仓与冻结数量已更新","RUN-240812-091"],["09:42:17","成交","600519 买入 100 股","RUN-240812-091"],["09:42:16","委托","模拟委托已提交","RUN-240812-091"],["09:42:12","风控","集中度检查通过","RUN-240812-091"],["09:42:11","信号","策略生成加仓信号","RUN-240812-091"],["09:40:03","数据","分钟数据延迟 2 分钟","RUN-240812-088"],["09:39:58","人工操作","值班员确认暂停","RUN-240812-088"]];

export function RunsPage({ initialRunId, initialStatus }: { initialRunId?: string; initialStatus?: RunStatusFilter }) {
  const [filter, setFilter] = useState<RunStatusFilter>(initialStatus ?? "全部");
  const [confirm, setConfirm] = useState(false);
  const [feedback, setFeedback] = useState("");
  const visible = filter === "全部" ? tasks : tasks.filter(task => task.status === filter);
  const exportRecords = () => setFeedback("运行记录已导出");
  const openTask = (task: typeof tasks[number]) => setFeedback(`${task.action === "查看错误" ? "失败详情" : task.action} · ${task.id}`);
  return <>
    <div className="page-heading"><div><p className="eyebrow">RUN RECORDS · LOCAL PROTOTYPE SNAPSHOT</p><h1>运行记录</h1><p>按任务、运行 ID 与严重级别回放研究和执行链路；当前数值为原型演示快照。</p></div><div className="heading-actions"><button className="button" onClick={exportRecords}>导出记录</button><button className="button button--primary" onClick={() => setConfirm(true)}>重跑失败任务</button></div></div>
    {feedback && <div className="notice" role="status"><span>{feedback}</span></div>}
    {initialRunId && <div className="notice"><span>已保留运行上下文：<code>{initialRunId}</code></span></div>}
    <section className="health-grid">{[["今日运行","128"],["运行中","4"],["已完成","121"],["警告","2"],["失败","1"],["最长排队","00:01:12"]].map(([label,value]) => <div className="health-check" key={label}><span>{label}</span><span>{value}</span></div>)}</section>
    <section className="panel"><div className="section-heading"><div><span className="section-kicker">TASKS</span><h2>任务列表</h2></div><div className="heading-actions"><label>运行状态筛选<select aria-label="运行状态筛选" value={filter} onChange={e => setFilter(e.target.value as RunStatusFilter)}><option>全部</option><option>运行中</option><option>已完成</option><option>警告</option><option>失败</option></select></label><span className="muted">演示快照 · 最近 24 小时</span></div></div><div className="table-wrap"><table><thead><tr><th>运行 ID</th><th>任务</th><th>策略</th><th>状态</th><th>开始时间</th><th>耗时</th><th>操作</th></tr></thead><tbody>{visible.map(task => <tr key={task.id}><td><code>{task.id}</code></td><td>{task.task}</td><td>{task.strategy}</td><td>{task.status}</td><td><code>{task.time}</code></td><td><code>{task.elapsed}</code></td><td><button className="text-button" aria-label={`${task.action} ${task.id}`} onClick={() => openTask(task)}>{task.action}</button></td></tr>)}</tbody></table></div></section>
    <section className="two-column"><section className="panel"><div className="section-heading"><h2>最近失败</h2><span className="status-badge status-badge--negative">策略错误</span></div><div className="panel-body"><div className="detail-block"><h3>错误码</h3><p><code>DATA_GAP_MINUTE_BAR</code></p></div><div className="detail-block"><h3>说明</h3><p>600519 缺少 09:39 与 09:40 两个分钟桶，策略验证已停止，未写入实验结果。</p></div><div className="detail-block"><h3>影响范围</h3><p className="muted">实验结果未写入 · <code>RUN-240812-085</code></p></div><button className="button" onClick={() => setFeedback("apexquant run retry RUN-240812-085 · 命令已复制")}>复制 CLI 重跑命令</button></div></section><section className="panel"><div className="section-heading"><h2>最近审计事件</h2><span className="muted">按时间倒序</span></div><ol className="timeline">{audit.map(([time,type,summary,runId]) => <li key={time+type}><span className="timeline-dot">·</span><div><header><time>{time}</time><span className="status-badge status-badge--neutral">{type}</span></header><p>{summary}</p><code>{runId}</code></div></li>)}</ol></section></section>
    {confirm && <div className="modal-backdrop"><section className="confirmation" role="dialog" aria-label="重跑确认"><h2>重跑确认</h2><p>将复制原策略、数据、成本和种子，创建新运行；原失败记录不会修改。</p><div className="confirmation-actions"><button className="button" onClick={() => setConfirm(false)}>取消</button><button className="button button--primary" onClick={() => { setConfirm(false); setFeedback("已创建新运行 RUN-240812-096 · 源记录 RUN-240812-085 保持不变"); }}>确认创建新运行</button></div></section></div>}
  </>;
}
