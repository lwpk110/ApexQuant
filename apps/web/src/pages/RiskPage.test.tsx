import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RiskPage } from "./RiskPage";

describe("RiskPage", () => {
  it("renders account, T+1, value closure, limits, and event provenance", () => {
    render(<RiskPage />);
    ["融资负债", "融券负债", "维持担保比例", "总持仓", "可用持仓", "T+1 冻结", "其他持仓", "边际风险贡献", "总杠杆限额", "回撤暂停"].forEach(text => expect(screen.getAllByText(text).length).toBeGreaterThan(0));
    expect(screen.getAllByText("run_sim_8f2c1a").length).toBeGreaterThan(0);
  });

  it("filters risk events and requires exact simulated-liquidation confirmation", async () => {
    const user = userEvent.setup();
    render(<RiskPage initialAlertFilter="预警" />);
    expect(screen.getByLabelText("风险事件状态筛选")).toHaveValue("预警");
    await user.click(screen.getByRole("button", { name: "模拟强平" }));
    const confirm = screen.getByRole("button", { name: "确认模拟强平" });
    expect(confirm).toBeDisabled();
    await user.type(screen.getByLabelText("确认文本"), "确认模拟强平");
    await user.click(confirm);
    expect(screen.getByText(/已创建模拟运行 run_liq_94af/)).toBeInTheDocument();
    expect(screen.getByText(/不发送真实委托/)).toBeInTheDocument();
  });

  it("previews a versioned risk-limit change before save", async () => {
    const user = userEvent.setup();
    render(<RiskPage />);
    await user.click(screen.getByRole("button", { name: "编辑风险限额" }));
    expect(screen.getByRole("dialog", { name: "风险限额影响预览" })).toBeInTheDocument();
    ["新配置版本", "影响范围", "预计行为", "生效时间", "旧值", "新值"].forEach(text => expect(screen.getByText(text)).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: "保存风险限额版本" }));
    expect(screen.getByText(/已保存风险限额版本 CONFIG-RISK-20260814.4/)).toBeInTheDocument();
  });
});
