import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { BacktestPage } from "./BacktestPage";

vi.mock("../api", () => ({
  submitBacktest: vi.fn().mockRejectedValue(new Error("backend unavailable in component test")),
}));

describe("BacktestPage", () => {
  it("renders the single-page reproducible configuration", () => {
    render(<BacktestPage />);
    expect(screen.getByRole("region", { name: "回测配置" })).toBeInTheDocument();
    expect(screen.getByLabelText("策略版本")).toBeInTheDocument();
    expect(screen.getByLabelText("数据版本")).toBeInTheDocument();
    expect(screen.getByLabelText("随机种子")).toBeInTheDocument();
    expect(screen.getAllByText("信用参数未启用").length).toBeGreaterThanOrEqual(1);
  });

  it("shows run snapshot metadata and metric tabs", () => {
    render(<BacktestPage />);
    expect(screen.getByText("run_bt_8f2c1a")).toBeInTheDocument();
    expect(screen.getByText("数据泄漏检查")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "交易明细" })).toBeInTheDocument();
    expect(screen.getByText("+18.42%")).toBeInTheDocument();
  });

  it("limits comparison to four experiments and warns on mixed data versions", async () => {
    const user = userEvent.setup();
    render(<BacktestPage />);
    await user.click(screen.getByRole("button", { name: "打开实验对比" }));
    expect(screen.getByText(/最多选择 4 个实验/)).toBeInTheDocument();
    await user.click(screen.getByLabelText("选择行业均值回归"));
    expect(screen.getByText(/数据版本不同/)).toBeInTheDocument();
  });

  it("creates a new reproducible run without broker execution", async () => {
    const user = userEvent.setup();
    const onRun = vi.fn();
    render(<BacktestPage onRun={onRun} />);
    await user.click(screen.getByRole("button", { name: "运行回测" }));
    expect(onRun).toHaveBeenCalledWith(expect.objectContaining({ realBroker: false }));
    expect(screen.getByText(/回测提交失败/)).toBeInTheDocument();
  });

  it("creates and displays an immutable local run snapshot", async () => {
    const user = userEvent.setup();
    render(<BacktestPage />);

    await user.click(screen.getByRole("button", { name: "运行回测" }));

    expect(screen.getByText("本次运行快照")).toBeInTheDocument();
    expect(screen.getAllByText("run_bt_local_20260814_001").length).toBeGreaterThan(0);
    expect(screen.getByText(/不产生真实柜台委托/)).toBeInTheDocument();
  });

  it("opens metric contribution detail and preserves trade provenance", async () => {
    const user = userEvent.setup();
    render(<BacktestPage />);

    await user.click(screen.getByRole("button", { name: /年化收益/ }));
    expect(screen.getByRole("dialog", { name: "年化收益贡献明细" })).toBeInTheDocument();
    expect(screen.getAllByText("run_bt_8f2c1a").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "关闭指标贡献明细" }));
    await user.click(screen.getByRole("tab", { name: "交易明细" }));
    expect(screen.getByRole("columnheader", { name: "运行 ID" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "策略版本" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "数据版本" })).toBeInTheDocument();
  });

  it("caps selections at four and does not enable a mixed-version shared series", async () => {
    const user = userEvent.setup();
    render(<BacktestPage />);
    await user.click(screen.getByRole("button", { name: "打开实验对比" }));
    await user.click(screen.getByLabelText("选择红利低波防御"));
    await user.click(screen.getByLabelText("选择行业均值回归"));
    await user.click(screen.getByLabelText("选择质量因子精选"));

    expect(screen.getByText("已达到 4 个实验上限")).toBeInTheDocument();
    expect(screen.getByLabelText("选择趋势突破")).toBeDisabled();
    expect(screen.getByText(/不能在同一净值图中共绘/)).toBeInTheDocument();
  });

  it("captures the selected configuration in the local immutable run snapshot", async () => {
    const user = userEvent.setup();
    render(<BacktestPage />);

    await user.selectOptions(screen.getByLabelText("策略版本"), "strategy_momentum_v0.3.1");
    await user.selectOptions(screen.getByLabelText("数据版本"), "cn-day-v20260813.1");
    await user.click(screen.getByRole("button", { name: "运行回测" }));

    expect(screen.getByRole("region", { name: "本次运行快照" })).toHaveTextContent("strategy_momentum_v0.3.1");
    expect(screen.getByRole("region", { name: "本次运行快照" })).toHaveTextContent("cn-day-v20260813.1");
    expect(screen.getByText("snapshot: locked")).toBeInTheDocument();
  });

  it("provides local feedback when copying the run identifier", async () => {
    const user = userEvent.setup();
    render(<BacktestPage />);

    await user.click(screen.getByRole("button", { name: /复制运行 ID/ }));

    expect(screen.getByRole("status")).toHaveTextContent("运行 ID 已复制");
  });
});
