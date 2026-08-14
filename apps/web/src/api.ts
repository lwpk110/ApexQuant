export type BackendHealth = {
  status: "ready";
  timezone: string;
  realBroker: false;
};

export type BacktestSubmission = {
  strategyVersion: string;
  dataVersion: string;
  costModelVersion: string;
  randomSeed: number;
  startDate: string;
  endDate: string;
  initialCapital: string;
  deterministicReturn?: string;
};

export type BacktestResponse = {
  runId: string;
  status: string;
  provenance: Record<string, unknown>;
  metrics: { run_id: string; total_return: string; ending_capital: string };
};

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const payload = await response.json().catch(() => null) as { data?: T; error?: { message?: string } } | null;
  if (!response.ok || !payload?.data) throw new Error(payload?.error?.message || `API 请求失败 (${response.status})`);
  return payload.data;
}

export function getHealth(): Promise<BackendHealth> {
  return request<BackendHealth>("/api/health");
}

export function submitBacktest(snapshot: BacktestSubmission): Promise<BacktestResponse> {
  return request<BacktestResponse>("/api/backtests", { method: "POST", body: JSON.stringify(snapshot) });
}
