import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { OverviewPage } from "./OverviewPage";
import App from "../App";

describe("OverviewPage", () => {
  it("renders six concrete health checks and current risk limits", () => {
    render(<OverviewPage onNavigate={() => undefined} />);

    expect(screen.getByRole("region", { name: "系统健康" })).toBeInTheDocument();
    expect(screen.getByText("分钟数据延迟 12 秒")).toBeInTheDocument();
    expect(screen.getByText("18.60% / 20.00%")).toBeInTheDocument();
    expect(screen.getByText("1.42x / 2.00x")).toBeInTheDocument();
  });

  it("renders the complete account and strategy-operation read model", () => {
    render(<OverviewPage onNavigate={() => undefined} />);

    expect(screen.getByText("融资负债")).toBeInTheDocument();
    expect(screen.getByText("融券负债")).toBeInTheDocument();
    expect(screen.getByText("维持担保比例")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "目标换手" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "操作" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "查看运行" })).toHaveLength(3);
  });

  it("sends the selected execution status to simulation", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<OverviewPage onNavigate={onNavigate} />);

    await user.click(screen.getByRole("button", { name: "待风控 3 笔委托" }));
    expect(onNavigate).toHaveBeenCalledWith("simulation", { executionStatus: "待风控" });
  });

  it("preserves an execution-queue selection when simulation opens", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "待风控 3 笔委托" }));

    expect(screen.getByLabelText("状态筛选")).toHaveValue("待风控");
    expect(screen.getByText("没有符合当前筛选的委托")).toBeInTheDocument();
  });

  it("requires typed confirmation before pausing strategies", async () => {
    const user = userEvent.setup();
    render(<OverviewPage onNavigate={() => undefined} />);

    await user.click(screen.getByRole("button", { name: "暂停全部策略" }));
    const confirm = screen.getByRole("button", { name: "确认暂停全部策略" });
    expect(confirm).toBeDisabled();

    await user.type(screen.getByLabelText("确认文本"), "确认暂停");
    await user.click(confirm);
    expect(screen.getByText(/已暂停 3 个策略/)).toBeInTheDocument();
    expect(screen.getByText(/平仓、撤单和风险处理仍可执行/)).toBeInTheDocument();
  });

  it("shows the required pre-run paper-simulation preview", async () => {
    const user = userEvent.setup();
    render(<OverviewPage onNavigate={() => undefined} />);

    await user.click(screen.getByRole("button", { name: "运行本次模拟" }));

    expect(screen.getByRole("dialog", { name: "运行本次模拟预览" })).toBeInTheDocument();
    expect(screen.getByText("数据时间")).toBeInTheDocument();
    expect(screen.getByText("待执行策略")).toBeInTheDocument();
    expect(screen.getByText("预计委托数")).toBeInTheDocument();
    expect(screen.getByText("风险检查结果")).toBeInTheDocument();
  });

  it("opens reconciliation differences as a read-only disclosure", async () => {
    const user = userEvent.setup();
    render(<OverviewPage onNavigate={() => undefined} />);

    await user.click(screen.getByRole("button", { name: "查看差异" }));

    expect(screen.getByRole("dialog", { name: "对账差异" })).toBeInTheDocument();
    expect(screen.getByText("只读核对")).toBeInTheDocument();
    expect(screen.getByText("模拟账本快照")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /确认同步|写入账本/ })).not.toBeInTheDocument();
  });

  it("offers the 30-trading-day industry-exposure analysis view", async () => {
    const user = userEvent.setup();
    render(<OverviewPage onNavigate={() => undefined} />);

    await user.click(screen.getByRole("button", { name: "行业暴露" }));

    expect(screen.getByLabelText("行业暴露趋势图")).toBeInTheDocument();
    expect(screen.getByText("近 30 个交易日")).toBeInTheDocument();
  });

  it("changes the trend data representation with each analytics view", async () => {
    const user = userEvent.setup();
    render(<OverviewPage onNavigate={() => undefined} />);

    await user.click(screen.getByRole("button", { name: "回撤" }));
    expect(screen.getByText("最大回撤 -4.36%")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "杠杆" }));
    expect(screen.getByText("当前总杠杆 1.42x")).toBeInTheDocument();
  });

  it("renders every required overview audit category in reverse chronological order", () => {
    render(<OverviewPage onNavigate={() => undefined} />);

    const timeline = document.querySelector<HTMLOListElement>(".timeline");
    expect(timeline).toBeInTheDocument();
    ["手动操作", "数据问题", "成交", "委托", "风控判定", "信号"].forEach(type => expect(within(timeline!).getByText(type)).toBeInTheDocument());
    const times = within(timeline!).getAllByRole("listitem").map(item => item.querySelector("time")?.textContent);
    expect(times).toEqual(["09:42:20", "09:42:19", "09:42:14", "09:42:13", "09:42:12", "09:42:11"]);
  });

  it("keeps the main workspace beside the fixed sidebar", () => {
    render(<App />);
    const workspace = document.querySelector(".workspace");
    expect(workspace).toBeInTheDocument();
    expect(workspace?.parentElement?.classList.contains("main-area")).toBe(true);
    const navigation = screen.getByRole("navigation", { name: "主导航" });
    ["总览", "策略实验室", "回测中心", "模拟执行", "账户与风险", "数据中心", "运行记录", "设置"].forEach(label => expect(within(navigation).getByRole("button", { name: label })).toBeInTheDocument());
  });

  it("shows concrete global status and hands a risk alert to its filtered destination", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText("交易日 2026-08-14")).toBeInTheDocument();
    expect(screen.getByText("行情 09:42:18 CST")).toBeInTheDocument();
    expect(screen.getByText("新鲜度 12 秒")).toBeInTheDocument();
    expect(screen.getByText("模拟账户 · AQ-PAPER-001")).toBeInTheDocument();
    expect(screen.getByText("运行中")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "3 条风险告警" }));

    expect(screen.getByRole("heading", { name: "账户与风险" })).toBeInTheDocument();
    expect(screen.getByText("预警")).toBeInTheDocument();
  });

  it("provides search feedback for blank and submitted global queries", async () => {
    const user = userEvent.setup();
    render(<App />);
    const search = screen.getByLabelText("全局搜索");

    await user.click(search);
    await user.keyboard("{Enter}");
    expect(screen.getByRole("status")).toHaveTextContent("请输入策略、标的或运行 ID");

    await user.type(search, "run_sim_8f2c1a");
    await user.keyboard("{Enter}");
    expect(screen.getByRole("status")).toHaveTextContent("已提交搜索：run_sim_8f2c1a");
  });
});
