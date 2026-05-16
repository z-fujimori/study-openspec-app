import test from "node:test";
import assert from "node:assert/strict";

import { MemoryStorage, LocalTaskRepository } from "../src/taskRepository.js";
import { TaskService, TaskValidationError } from "../src/taskService.js";

test("validates the MVP flow against the task-management scenarios", () => {
  const repository = new LocalTaskRepository(new MemoryStorage());
  let nextId = 1;
  const service = new TaskService(repository, () => `flow-${nextId++}`);

  assert.deepEqual(service.listTasks(), []);

  assert.throws(() => service.createTask(""), TaskValidationError);

  const first = service.createTask("Plan release");
  const second = service.createTask("Review tests");

  assert.deepEqual(
    service.listTasks().map((task) => ({
      id: task.id,
      title: task.title,
      completed: task.completed,
    })),
    [
      { id: first.id, title: "Plan release", completed: false },
      { id: second.id, title: "Review tests", completed: false },
    ],
  );

  service.completeTask(first.id);
  assert.equal(service.listTasks()[0]?.completed, true);
  assert.equal(service.listTasks()[1]?.completed, false);

  service.deleteTask(first.id);
  service.deleteTask(second.id);
  assert.deepEqual(service.listTasks(), []);
});
