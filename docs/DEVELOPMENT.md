# 开发说明

## 环境

- Python 3.11+
- 可选开发依赖：`pip install -e ".[dev]"`
- Windows 开发机若 `python` 未加入 PATH，可使用 Codex/团队提供的 Python 运行时，或将项目 Python 加入 PATH。

## 常用命令

```powershell
python -m unittest discover -s tests -v
python -m apexquant.interfaces.cli doctor --json
python -m compileall src tests
```

首次安装后建议依次运行 `doctor`、单元测试和编译检查；任何真实数据源、券商或通知密钥都只通过环境变量注入，不提交到仓库。

安装项目后也可使用：

```powershell
apexquant doctor
```

## 约定

- 所有持久化时间带时区，界面统一 `Asia/Shanghai`。
- 金额和价格使用 `Decimal`，禁止用浮点数承载交易金额。
- 领域规则返回规则 ID 和人话说明，不在底层静默抛弃订单。
- 新页面或字段先更新 `REQUIREMENTS-0.0.1.md` / `SRS-0.0.1.md`，再实现。
- 真实柜台、真实委托、未经版本化的数据覆盖均不属于 0.0.1。
