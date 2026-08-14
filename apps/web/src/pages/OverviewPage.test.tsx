import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { OverviewPage } from "./OverviewPage";

vi.mock("../api", () => ({
  getOverview: vi.fn().mockResolvedValue({ health: { status: "ready", timezone: "Asia/Shanghai", realBroker: false }, account: { netAsset: "100.00", availableCash: "50.00", positionValue: "50.00" }, activeRuns: [], market: { symbol: "000001.SS", quote: { price: 3000, previousClose: 2990, change: 10, changePercent: 0.33, currency: "CNY" }, source: "yahoo-finance", fetchedAt: "2026-08-15T00:00:00Z", stale: false, quality: { state: "ready" } } }),
}));

describe("OverviewPage API read model", () => {
  it("renders live quote, source and simulated account", async () => {
    render(<OverviewPage onNavigate={() => undefined} />);
    expect(await screen.findByText("3000.00 CNY")).toBeInTheDocument();
    expect(screen.getByText(/来源 yahoo-finance/)).toBeInTheDocument();
    expect(screen.getByText("后端模拟账本")).toBeInTheDocument();
  });

  it("shows API errors without fixture fallback", async () => {
    const api = await import("../api");
    vi.mocked(api.getOverview).mockRejectedValueOnce(new Error("网络不可用"));
    render(<OverviewPage onNavigate={() => undefined} />);
    expect(await screen.findByRole("alert")).toHaveTextContent("网络不可用");
    expect(screen.getByRole("button", { name: /重试/ })).toBeInTheDocument();
  });
});
