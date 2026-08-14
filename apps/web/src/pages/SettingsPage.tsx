import { useState } from "react";

const rules = [
  ["市场", "A 股（沪深）"],
  ["最小交易单位", "100 股"],
  ["价格偏离", "2.00%"],
  ["当日亏损上限", "3.00%"],
  ["单票集中度上限", "20.00%"],
  ["总杠杆上限", "2.00x"],
  ["T+1", "启用"],
  ["涨跌停控制", "启用"],
];

const costs = [["佣金", "万 2.5"], ["最低佣金", "¥5.00"], ["印花税", "卖出 0.05%"], ["沪市过户费", "0.001%"], ["默认滑点", "0.05%"], ["成交假设", "下一根 K 线开盘价"], ["价格取整", "按最小交易单位"]];
const defaults = [["基准", "000300.SH 沪深 300"], ["随机种子", "20260814"], ["初始资金", "¥1,000,000"], ["订单超时", "30 秒"], ["行情延迟阈值", "90 秒"]];

export function SettingsPage() {
  const [preview, setPreview] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [paused, setPaused] = useState(true);
  const save = () => { setPreview(false); setFeedback("已保存配置版本 CONFIG-20260814.7 · 生效于后续模拟运行"); };
  const rollback = () => setFeedback("已恢复配置版本 CONFIG-20260814.6 · 历史运行快照保持不变");
  return <>
    <div className="page-heading"><div><p className="eyebrow">SETTINGS · LOCAL PROTOTYPE SNAPSHOT</p><h1>设置</h1><p>交易规则、成本、模拟默认值与通知的版本化本地配置。</p></div><div className="heading-actions"><button className="button" onClick={rollback}>撤销到上一版本</button><button className="button button--primary" onClick={() => setPreview(true)}>保存配置</button></div></div>
    {feedback && <div className="notice"><span>{feedback}</span></div>}
    <section className="two-column">
      <section className="panel"><div className="section-heading"><div><span className="section-kicker">TRADING RULES</span><h2>交易规则</h2></div><span className="muted">本地快照</span></div><div className="queue-list">{rules.map(([label, value]) => <div className="queue-item" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>
      <section className="panel"><div className="section-heading"><div><span className="section-kicker">COST MODEL</span><h2>费用模型</h2></div><code>costs-cn-v1.2</code></div><div className="queue-list">{costs.map(([label, value]) => <div className="queue-item" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>
    </section>
    <section className="two-column">
      <section className="panel"><div className="section-heading"><div><span className="section-kicker">PAPER DEFAULTS</span><h2>模拟默认值</h2></div></div><div className="queue-list">{defaults.map(([label, value]) => <div className="queue-item" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>
      <section className="panel"><div className="section-heading"><div><span className="section-kicker">SAFEGUARDS</span><h2>数据异常保护</h2></div></div><div className="panel-body"><label className="toggle-row"><input type="checkbox" aria-label="暂停新信号" checked={paused} onChange={event => setPaused(event.target.checked)} /><span><strong>暂停新信号</strong><small>数据延迟或缺口时暂停开仓。</small></span></label><label className="toggle-row"><input type="checkbox" aria-label="允许平仓" defaultChecked /><span><strong>允许平仓</strong><small>数据异常时继续执行平仓处理。</small></span></label><label className="toggle-row"><input type="checkbox" aria-label="允许撤单" defaultChecked /><span><strong>允许撤单</strong><small>数据异常时继续撤销未成交委托。</small></span></label><p className="muted">当前状态：{paused ? "新信号已暂停 · 平仓和撤单可用" : "保护已关闭"}</p></div></section>
    </section>
    <section className="panel"><div className="section-heading"><div><span className="section-kicker">NOTIFICATIONS</span><h2>通知</h2></div><span className="muted">仅显示本地偏好</span></div><div className="queue-list">{[["风险告警", "站内 + 值班摘要"], ["策略失败", "站内"], ["数据延迟/缺口", "站内 + 值班摘要"], ["任务摘要", "每日 18:00"]].map(([label, value]) => <label className="queue-item" key={label}><span>{label}</span><strong>{value}</strong><input type="checkbox" aria-label={label} defaultChecked /></label>)}</div></section>
    <section className="panel"><div className="section-heading"><div><span className="section-kicker">CONFIGURATION HISTORY</span><h2>配置版本</h2></div></div><div className="table-wrap"><table><thead><tr><th>版本</th><th>生效时间</th><th>范围</th><th>变更摘要</th><th>状态</th></tr></thead><tbody><tr><td><code>CONFIG-20260814.7</code></td><td>2026-08-14 09:45 CST</td><td>后续模拟运行</td><td>单票上限 20.00% · 数据保护启用</td><td>待生效</td></tr><tr><td><code>CONFIG-20260814.6</code></td><td>2026-08-14 09:10 CST</td><td>全部模拟运行</td><td>基线配置</td><td>历史可读</td></tr></tbody></table></div></section>
    {preview && <div className="modal-backdrop"><section className="confirmation" role="dialog" aria-label="配置版本影响预览"><h2>配置版本影响预览</h2><dl><div><dt>新配置版本</dt><dd><code>CONFIG-20260814.7</code></dd></div><div><dt>影响范围</dt><dd>后续创建的模拟运行与开仓检查</dd></div><div><dt>旧值</dt><dd>单票集中度 20.00% · 数据保护启用</dd></div><div><dt>新值</dt><dd>单票集中度 20.00% · 数据保护启用</dd></div><div><dt>生效时间</dt><dd>2026-08-14 09:45:00 CST</dd></div></dl><div className="confirmation-actions"><button className="button" onClick={() => setPreview(false)}>取消</button><button className="button button--primary" onClick={save}>确认保存配置</button></div></section></div>}
  </>;
}
