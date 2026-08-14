import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RunsPage } from "./RunsPage";

describe("RunsPage", () => {
  it("renders run summaries, filterable tasks, errors, and audit categories", () => {
    render(<RunsPage initialRunId="RUN-240812-085" />);
    ["今日运行", "运行中", "已完成", "警告", "失败", "最长排队", "运行 ID", "错误码", "影响范围", "信号", "风控", "委托", "成交", "记账", "数据", "人工操作"].forEach(text => expect(screen.getAllByText(text).length).toBeGreaterThan(0));
    expect(screen.getAllByText("RUN-240812-085").length).toBeGreaterThan(0);
  });

  it("creates a new run while preserving the failed source record", async () => {
    const user = userEvent.setup();
    render(<RunsPage />);
    await user.selectOptions(screen.getByLabelText("运行状态筛选"), "失败");
    await user.click(screen.getByRole("button", { name: "重跑失败任务" }));
    expect(screen.getByRole("dialog", { name: "重跑确认" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "确认创建新运行" }));
    expect(screen.getByText(/已创建新运行 RUN-240812-096/)).toBeInTheDocument();
    expect(screen.getAllByText("RUN-240812-085").length).toBeGreaterThan(0);
  });

  it("exposes OD table tools and row-specific replay actions", async () => {
    const user = userEvent.setup();
    render(<RunsPage />);

    expect(screen.getByRole("button", { name: "导出记录" })).toBeInTheDocument();
    expect(screen.getByText("BT-240812-116")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "回放链路 RUN-240812-091" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "打开诊断 RUN-240812-088" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "查看错误 RUN-240812-085" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "查看结果 BT-240812-116" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "导出记录" }));
    expect(screen.getByRole("status")).toHaveTextContent("运行记录已导出");
    await user.click(screen.getByRole("button", { name: "查看错误 RUN-240812-085" }));
    expect(screen.getByRole("status")).toHaveTextContent("失败详情 · RUN-240812-085");
  });

  it("renders explicit failure detail fields and event provenance", () => {
    render(<RunsPage />);
    expect(screen.getByRole("heading", { name: "错误码" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "说明" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "影响范围" })).toBeInTheDocument();
    expect(screen.getAllByText("RUN-240812-091").length).toBeGreaterThan(0);
    expect(screen.getAllByText("RUN-240812-088").length).toBeGreaterThan(0);
  });
});
