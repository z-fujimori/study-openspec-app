import test from "node:test";
import assert from "node:assert/strict";

import { MemoryStorage, LocalTaskRepository } from "../src/taskRepository.js";
import { TaskService, TaskValidationError } from "../src/taskService.js";

function createService() {
  const storage = new MemoryStorage();
  const repository = new LocalTaskRepository(storage);
  let nextId = 1;

  return new TaskService(repository, () => `task-${nextId++}`);
}

test("creates a task with a stable id and incomplete state", () => {
  const service = createService();

  const task = service.createTask("Write proposal");

  assert.equal(task.id, "task-1");
  assert.equal(task.title, "Write proposal");
  assert.equal(task.completed, false);
  assert.equal(service.listTasks().length, 1);
});

test("rejects empty task titles", () => {
  const service = createService();

  assert.throws(() => service.createTask("   "), TaskValidationError);
  assert.deepEqual(service.listTasks(), []);
});

test("lists multiple tasks in creation order", () => {
  const service = createService();

  service.createTask("First");
  service.createTask("Second");

  assert.deepEqual(
    service.listTasks().map((task) => task.title),
    ["First", "Second"],
  );
});

test("completes an active task and keeps it visible", () => {
  const service = createService();
  const task = service.createTask("Ship MVP");

  const completedTask = service.completeTask(task.id);

  assert.equal(completedTask?.completed, true);
  assert.equal(service.listTasks()[0]?.completed, true);
  assert.equal(service.listTasks().length, 1);
});

test("deletes active and completed tasks", () => {
  const service = createService();
  const activeTask = service.createTask("Keep");
  const completedTask = service.createTask("Remove");
  service.completeTask(completedTask.id);

  assert.equal(service.deleteTask(activeTask.id), true);
  assert.equal(service.deleteTask(completedTask.id), true);
  assert.deepEqual(service.listTasks(), []);
});
