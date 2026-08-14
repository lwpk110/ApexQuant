import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { StrategyLabPage } from "./StrategyLabPage";

describe("StrategyLabPage", () => {
  it("renders the three-column research workspace and required fields", () => {
    render(<StrategyLabPage />);
    expect(screen.getByRole("region", { name: "策略列表" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "参数与数据配置" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "信号与分析" })).toBeInTheDocument();
    expect(screen.getByLabelText("股票池")).toBeInTheDocument();
    expect(screen.getByLabelText("运行周期")).toBeInTheDocument();
    expect(screen.getByLabelText("模型版本")).toBeInTheDocument();
    expect(screen.getByText("策略参数")).toBeInTheDocument();
    expect(screen.getByText("最新验证运行")).toBeInTheDocument();
  });

  it("renders each analysis view in the current research workspace", async () => {
    const user = userEvent.setup();
    render(<StrategyLabPage />);

    await user.click(screen.getByRole("button", { name: "净值" }));
    expect(screen.getByText("样本外收益 +6.84%")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "因子" }));
    expect(screen.getByText("20 日动量")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "错误" }));
    expect(screen.getByText("暂无错误")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "信号" }));
    expect(screen.getByText("600519.SH")).toBeInTheDocument();
  });

  it("blocks validation when a data quality gate is not healthy", async () => {
    const user = userEvent.setup();
    render(<StrategyLabPage initialQuality="缺口 4 桶" />);
    await user.click(screen.getByRole("button", { name: "验证策略" }));
    expect(screen.getByText(/阻断分钟级验证/)).toBeInTheDocument();
    expect(screen.getByText(/缺口 4 桶 · 分钟级验证/)).toBeInTheDocument();
  });

  it("supports saving a draft and copying a strategy without leaving the lab", async () => {
    const user = userEvent.setup();
    render(<StrategyLabPage />);
    await user.click(screen.getByRole("button", { name: "保存草稿" }));
    expect(screen.getByText(/草稿已保存/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "复制策略" }));
    expect(screen.getByText(/已创建新草稿/)).toBeInTheDocument();
  });

  it("calls the experiment callback after a successful validation", async () => {
    const user = userEvent.setup();
    const onExperiment = vi.fn();
    render(<StrategyLabPage onExperiment={onExperiment} />);
    await user.click(screen.getByRole("button", { name: "创建实验" }));
    expect(onExperiment).toHaveBeenCalledWith(expect.objectContaining({ strategy: "沪深300动量轮动" }));
  });

  it("shows leakage failure provenance and blocks simulated lifecycle advancement", async () => {
    const user = userEvent.setup();
    render(<StrategyLabPage initialLeakage="失败" />);

    expect(screen.getByText("数据泄漏检查失败")).toBeInTheDocument();
    expect(screen.getByText(/run_val_leak_91c2/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "创建实验" }));
    expect(screen.getByText(/泄漏检查未通过/)).toBeInTheDocument();
  });

  it("keeps draft saving available when minute data is over 90 seconds late", async () => {
    const user = userEvent.setup();
    render(<StrategyLabPage initialQuality="行情延迟 128 秒" />);

    expect(screen.getAllByText(/行情延迟 128 秒/).length).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: "保存草稿" }));
    expect(screen.getByText(/草稿已保存/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "验证策略" }));
    expect(screen.getByText(/阻断分钟级验证/)).toBeInTheDocument();
  });

  it("does not allow an out-of-sample failure to create an experiment", async () => {
    const user = userEvent.setup();
    render(<StrategyLabPage initialOutOfSample="未通过" />);

    expect(screen.getByText("样本外评估未通过")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "创建实验" }));
    expect(screen.getByRole("status")).toHaveTextContent("样本外评估未通过");
  });

  it("creates an isolated duplicate draft and exposes the validation run record", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<StrategyLabPage onNavigate={onNavigate} />);

    await user.click(screen.getByRole("button", { name: "复制策略" }));
    expect(screen.getByText(/不继承源策略运行历史/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "运行记录" }));
    expect(onNavigate).toHaveBeenCalledWith("runs", { runId: "run_val_43af20" });
  });
});
