import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SettingsPage } from "./SettingsPage";

describe("SettingsPage", () => {
  it("shows trading, cost, simulation, safeguard, and notification settings", () => {
    render(<SettingsPage />);
    ["交易规则", "市场", "最小交易单位", "价格偏离", "当日亏损上限", "单票集中度上限", "总杠杆上限", "T+1", "涨跌停控制", "费用模型", "佣金", "最低佣金", "印花税", "沪市过户费", "默认滑点", "成交假设", "价格取整", "随机种子", "初始资金", "订单超时", "行情延迟阈值", "数据异常保护", "暂停新信号", "允许平仓", "允许撤单", "通知", "风险告警", "策略失败", "数据延迟/缺口", "任务摘要"].forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
    expect(screen.getByRole("checkbox", { name: "暂停新信号" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "允许平仓" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "允许撤单" })).toBeChecked();
  });

  it("previews and saves a version, then rolls back to the prior snapshot", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);
    await user.click(screen.getByRole("button", { name: "保存配置" }));
    expect(screen.getByRole("dialog", { name: "配置版本影响预览" })).toBeInTheDocument();
    expect(screen.getAllByText("CONFIG-20260814.7").length).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: "确认保存配置" }));
    expect(screen.getByText(/已保存配置版本 CONFIG-20260814.7/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "撤销到上一版本" }));
    expect(screen.getByText(/已恢复配置版本 CONFIG-20260814.6/)).toBeInTheDocument();
    expect(screen.getByText(/历史运行快照保持不变/)).toBeInTheDocument();
  });
});
