"""In-memory data-quality and synchronization adapter."""

from datetime import datetime
from uuid import uuid4

from apexquant.domain.data import DataQualityReport, DataVersion, SyncStatus, SyncTask


class InMemoryDataRepository:
    def __init__(self) -> None:
        self._tasks: dict[str, SyncTask] = {}
        self._current: dict[str, DataVersion] = {}
        self._history: dict[str, list[DataVersion]] = {}

    def start_sync(self, *, dataset_id: str, started_at: datetime) -> SyncTask:
        task = SyncTask(f"sync_{uuid4().hex[:12]}", dataset_id, "queued", 0, started_at)
        self._tasks[task.task_id] = task
        self._tasks[task.task_id] = task.transition(SyncStatus.RUNNING, stage="validating", message="同步任务已启动")
        return self._tasks[task.task_id]

    def _task(self, task_id: str) -> SyncTask:
        try:
            return self._tasks[task_id]
        except KeyError as exc:
            raise KeyError(f"unknown sync task: {task_id}") from exc

    def update_sync(self, task_id: str, *, stage: str, progress: int, message: str | None = None) -> SyncTask:
        task = self._task(task_id)
        if task.status is not SyncStatus.RUNNING:
            raise ValueError(f"cannot update terminal sync task: {task.status}")
        updated = task if progress == task.progress and stage == task.stage and message is None else task.__class__(task.task_id, task.dataset_id, stage, progress, task.started_at, task.status, task.log + ((message,) if message else ()))
        self._tasks[task_id] = updated
        return updated

    def cancel_sync(self, task_id: str, *, reason: str) -> SyncTask:
        task = self._task(task_id)
        updated = task.transition(SyncStatus.CANCELED, stage="canceled", message=f"同步已取消: {reason}")
        self._tasks[task_id] = updated
        return updated

    def complete_sync(self, task_id: str, *, quality: DataQualityReport, summary: str, completed_at: datetime) -> DataVersion:
        task = self._task(task_id)
        if task.status is not SyncStatus.RUNNING:
            raise ValueError(f"cannot complete sync task: {task.status}")
        if quality.dataset_id != task.dataset_id:
            raise ValueError("quality dataset does not match sync task")
        self._tasks[task_id] = task.transition(SyncStatus.COMPLETED, stage="completed", progress=100, message="同步完成")
        version = DataVersion(f"{task.dataset_id}_v{uuid4().hex[:10]}", task.dataset_id, completed_at, summary, quality)
        self._current[task.dataset_id] = version
        self._history.setdefault(task.dataset_id, []).append(version)
        return version

    def current_version(self, dataset_id: str) -> DataVersion | None:
        return self._current.get(dataset_id)

    def history(self, dataset_id: str) -> tuple[DataVersion, ...]:
        return tuple(self._history.get(dataset_id, ()))
