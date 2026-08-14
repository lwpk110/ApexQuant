import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { getCatalog, type CatalogResponse } from "../api";
import type { DataDiagnostic } from "../types";

export function DataPage({ diagnostic }: { diagnostic?: DataDiagnostic }) { const [data, setData] = useState<CatalogResponse | null>(null); const [error, setError] = useState(""); const load = () => { getCatalog().then(setData).catch(e => setError(e.message)); }; useEffect(() => { load(); }, []);
  if (!data && !error) return <div className="panel panel-body"><h1>数据中心</h1><p>正在加载后端数据目录...</p></div>;
  if (error) return <div className="panel panel-body"><h1>数据中心</h1><p role="alert">数据目录不可用：{error}</p><button className="button" onClick={load}><RefreshCw size={15}/>重试</button></div>;
  return <><div className="page-heading"><div><p className="eyebrow">DATA CENTER · API READ MODEL</p><h1>数据中心</h1><p>真实抓取结果、质量状态和数据源限制</p></div><button className="button" onClick={load}><RefreshCw size={15}/>刷新</button></div>{diagnostic && <div className="notice"><strong>数据诊断</strong><span>请检查后端返回的 quality 字段。</span></div>}<section className="panel"><div className="section-heading"><h2>数据集清单</h2><span className="muted">来源 {data!.source}</span></div><div className="table-wrap"><table><thead><tr>{["数据集","类型","来源","覆盖区间","最后更新","缺失桶数","质量","许可证 / 限制"].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{data!.datasets.map(row => <tr key={String(row.dataset)}><td><strong>{String(row.dataset)}</strong></td><td>{String(row.type)}</td><td>{String(row.source)}</td><td>{String(row.coverage)}</td><td>{row.updated ? new Date(String(row.updated)).toLocaleString("zh-CN") : "不可用"}</td><td>{String(row.missingBuckets ?? "未知")}</td><td>{String(row.status)}</td><td>{String(row.license)}</td></tr>)}</tbody></table></div></section></>;
}
