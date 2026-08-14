import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { RunsPage } from "./RunsPage";

vi.mock("../api", () => ({
  getRuns: vi.fn().mockResolvedValue({ total: 1, runs: [{ runId: "run_abc", strategyVersion: "strategy_v1", dataVersion: "000001.SS", status: "completed", createdAt: "2026-08-15T00:00:00Z" }] }),
}));

describe("RunsPage API read model", () => {
  it("renders backend runs and status summary", async () => {
    render(<RunsPage initialRunId="run_abc" />);
    expect((await screen.findAllByText("run_abc")).length).toBeGreaterThan(0);
    expect(screen.getByText("strategy_v1")).toBeInTheDocument();
    expect(screen.getByText("completed")).toBeInTheDocument();
  });

  it("renders an API error instead of demo records", async () => {
    const api = await import("../api");
    vi.mocked(api.getRuns).mockRejectedValueOnce(new Error("服务不可用"));
    render(<RunsPage />);
    expect(await screen.findByRole("alert")).toHaveTextContent("服务不可用");
  });
});
