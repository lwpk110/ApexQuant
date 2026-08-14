import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { SimulationPage } from "./SimulationPage";

describe("SimulationPage", () => {
  it("renders signal flow, order fields and five event types", () => {
    render(<SimulationPage />);
    expect(screen.getByText("09:42:18")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "策略信号流" })).toBeInTheDocument();
    expect(screen.getAllByText("剩余 300 股").length).toBeGreaterThan(0);
    expect(screen.getByText("保证金")).toBeInTheDocument();
    expect(screen.getByText("融资/融券额度")).toBeInTheDocument();
    ["信号", "风控判定", "委托", "成交", "记账"].forEach(type => expect(screen.getAllByText(type).length).toBeGreaterThan(0));
  });

  it("opens a signal snapshot with strategy, data, and run provenance", async () => {
    const user = userEvent.setup();
    render(<SimulationPage />);

    await user.click(screen.getByRole("link", { name: /数据快照 snap_20260814_094211/ }));

    expect(screen.getByRole("dialog", { name: "数据快照详情" })).toBeInTheDocument();
    expect(screen.getByText("策略版本")).toBeInTheDocument();
    expect(screen.getByText("数据版本")).toBeInTheDocument();
    expect(screen.getByText("运行 ID")).toBeInTheDocument();
  });

  it("combines filters and provides an actionable empty state", async () => {
    const user = userEvent.setup();
    render(<SimulationPage />);
    await user.selectOptions(screen.getByLabelText("状态筛选"), "已拒绝");
    await user.selectOptions(screen.getByLabelText("方向筛选"), "卖出");
    expect(screen.getByText(/没有符合当前筛选的委托/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "清除筛选" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "前往数据中心" })).toBeInTheDocument();
  });

  it("combines strategy with symbol, status and side filters", async () => {
    const user = userEvent.setup();
    render(<SimulationPage />);
    await user.selectOptions(screen.getByLabelText("策略筛选"), "红利低波防御");
    await user.selectOptions(screen.getByLabelText("方向筛选"), "卖出");
    expect(screen.getByText("没有符合当前筛选的委托")).toBeInTheDocument();
  });

  it("takes an empty order result to the data diagnostic route", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<SimulationPage onNavigate={onNavigate} />);
    await user.selectOptions(screen.getByLabelText("状态筛选"), "已拒绝");
    await user.selectOptions(screen.getByLabelText("方向筛选"), "卖出");

    await user.click(screen.getByRole("button", { name: "前往数据中心" }));

    expect(onNavigate).toHaveBeenCalledWith("data", { diagnostic: "data-quality" });
  });

  it("keeps new entries paused on stale data and preserves close/cancel actions", async () => {
    const user = userEvent.setup();
    render(<SimulationPage initialQuality="行情延迟 128 秒" />);
    expect(screen.getByText(/新开仓已阻断/)).toBeInTheDocument();
    expect(screen.getByText(/平仓、撤单和风险处理仍可执行/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "恢复执行" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "模拟修复数据质量" }));
    expect(screen.getByRole("button", { name: "恢复执行" })).toBeEnabled();
  });

  it("combines all four filters and keeps the execution audit chain ordered", async () => {
    const user = userEvent.setup();
    render(<SimulationPage />);

    await user.selectOptions(screen.getByLabelText("策略筛选"), "沪深300动量轮动");
    await user.selectOptions(screen.getByLabelText("标的筛选"), "600519.SH");
    await user.selectOptions(screen.getByLabelText("状态筛选"), "已完成");
    await user.selectOptions(screen.getByLabelText("方向筛选"), "买入");
    expect(screen.getByText("¥1,703.80")).toBeInTheDocument();

    const steps = document.querySelectorAll(".execution-timeline .event-type");
    expect(Array.from(steps, step => step.textContent)).toEqual(["信号", "风控判定", "委托", "成交", "记账"]);
  });

  it("rechecks repaired data before resuming while close, cancel, and risk actions stay available", async () => {
    const user = userEvent.setup();
    render(<SimulationPage initialQuality="行情延迟 128 秒" />);

    expect(screen.getByRole("button", { name: "平仓处理" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "撤销委托" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "风险处理" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "模拟修复数据质量" }));
    await user.click(screen.getByRole("button", { name: "恢复执行" }));
    expect(screen.getByText(/模拟执行已恢复/)).toBeInTheDocument();
  });

  it("shows the paused state after pausing new opening exposure", async () => {
    const user = userEvent.setup();
    render(<SimulationPage />);

    await user.click(screen.getByRole("button", { name: "暂停开仓" }));

    expect(screen.getByLabelText("模拟暂停")).toBeInTheDocument();
    expect(screen.getAllByText(/新开仓已暂停/).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "恢复执行" })).toBeEnabled();
  });
});
