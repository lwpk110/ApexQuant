import { afterEach, describe, expect, it, vi } from "vitest";
import { getHealth, submitBacktest } from "./api";

afterEach(() => vi.unstubAllGlobals());

describe("MVP API client", () => {
  it("reads health through the JSON envelope", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: { status: "ready", timezone: "Asia/Shanghai", realBroker: false } }), { status: 200 })));
    await expect(getHealth()).resolves.toMatchObject({ status: "ready", realBroker: false });
  });

  it("surfaces structured backend errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: { code: "MISSING_FIELD", message: "缺少字段" } }), { status: 400 })));
    await expect(submitBacktest({ strategyVersion: "s", dataVersion: "d", costModelVersion: "c", randomSeed: 1, startDate: "2025-01-01", endDate: "2025-01-02", initialCapital: "1" })).rejects.toThrow("缺少字段");
  });
});
