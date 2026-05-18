import { createTaskRecord } from "./taskModel.js";

export class TaskValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "TaskValidationError";
  }
}

export class TaskService {
  constructor(repository, createId = () => crypto.randomUUID()) {
    this.repository = repository;
    this.createId = createId;
  }

  listTasks() {
    return this.repository.list().sort((left, right) => left.createdAt.localeCompare(right.createdAt));
  }

  createTask(title) {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      throw new TaskValidationError("Task title cannot be empty.");
    }

    const tasks = this.listTasks();
    const task = createTaskRecord({
      id: this.createId(),
      title: normalizedTitle,
      completed: false,
    });

    this.repository.saveAll([...tasks, task]);
    return task;
  }

  completeTask(taskId) {
    return this.#updateCompletionState(taskId, true);
  }

  activateTask(taskId) {
    return this.#updateCompletionState(taskId, false);
  }

  deleteTask(taskId) {
    const tasks = this.listTasks();
    const nextTasks = tasks.filter((task) => task.id !== taskId);
    if (nextTasks.length === tasks.length) {
      return false;
    }

    this.repository.saveAll(nextTasks);
    return true;
  }

  #updateCompletionState(taskId, completed) {
    let changed = false;
    const nextTasks = this.listTasks().map((task) => {
      if (task.id !== taskId) {
        return task;
      }

      changed = true;
      return { ...task, completed };
    });

    if (!changed) {
      return null;
    }

    this.repository.saveAll(nextTasks);
    return nextTasks.find((task) => task.id === taskId) ?? null;
  }
}
