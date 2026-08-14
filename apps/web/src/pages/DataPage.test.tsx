import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataPage } from "./DataPage";

describe("DataPage", () => {
  it("renders inventory, timezone, quality checks, and immutable versions", () => {
    render(<DataPage />);
    ["数据集", "类型", "来源", "覆盖区间", "最后更新", "缺失率", "缺失桶数", "复权状态", "许可证 / 限制", "状态", "操作", "CN-CALENDAR", "CN-FACTOR", /Asia\/Shanghai/, "时间连续性", "OHLC 合法性", "复权因子跳变", "CN-A-1m v2026.08"].forEach(text => expect(screen.getAllByText(text).length).toBeGreaterThan(0));
    expect(screen.getByRole("button", { name: "列显隐" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "导出 CSV" })).toBeInTheDocument();
  });

  it("runs a repair sync and creates a new current version", async () => {
    const user = userEvent.setup();
    render(<DataPage diagnostic="delayed-minute-data" />);
    expect(screen.getAllByText(/延迟 2 分钟/).length).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: "打开诊断" }));
    expect(screen.getByText(/诊断入口已打开/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "开始同步" }));
    expect(screen.getByText("下载缺失分钟桶")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "取消同步" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "查看同步日志" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "完成本地同步" }));
    expect(screen.getByText("CN-A-1m v2026.08.12.1")).toBeInTheDocument();
    expect(screen.getByText("旧版本可读")).toBeInTheDocument();
  });
});
