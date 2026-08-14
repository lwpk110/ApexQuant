## MODIFIED Requirements

### Requirement: Run records
运行记录 SHALL 从后端 `/api/runs` 读取当前进程的真实运行，回测提交成功后列表可刷新看到新 runId。

#### Scenario: Run list loads
- **WHEN** 页面打开且 API 可用
- **THEN** 列表展示后端返回的运行记录和状态统计

#### Scenario: New run appears
- **WHEN** 用户提交回测并刷新运行记录
- **THEN** 新生成的 runId 出现在列表中
