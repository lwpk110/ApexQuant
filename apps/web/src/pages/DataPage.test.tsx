import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { DataPage } from "./DataPage";

vi.mock("../api", () => ({
  getCatalog: vi.fn().mockResolvedValue({ source: "yahoo-finance", realBroker: false, datasets: [{ dataset: "000001.SS", type: "指数日线", source: "yahoo-finance", coverage: "2026-01-01 — 2026-08-15", updated: "2026-08-15T00:00:00Z", missingBuckets: 0, status: "ready", license: "研究用途" }] }),
}));

describe("DataPage API read model", () => {
  it("renders catalog returned by backend", async () => {
    render(<DataPage />);
    expect(await screen.findByText("000001.SS")).toBeInTheDocument();
    expect(screen.getByText("yahoo-finance")).toBeInTheDocument();
    expect(screen.getByText("研究用途")).toBeInTheDocument();
  });

  it("renders a retryable error", async () => {
    const api = await import("../api");
    vi.mocked(api.getCatalog).mockRejectedValueOnce(new Error("上游限流"));
    render(<DataPage />);
    expect(await screen.findByRole("alert")).toHaveTextContent("上游限流");
  });
});
