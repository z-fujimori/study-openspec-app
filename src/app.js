import { LocalTaskRepository } from "./taskRepository.js";
import { TaskService, TaskValidationError } from "./taskService.js";

function formatCount(count) {
  return `${count} task${count === 1 ? "" : "s"}`;
}

function formatTaskMeta(task) {
  const date = new Date(task.createdAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return task.completed ? `Completed · created ${date}` : `Active · created ${date}`;
}

function renderTaskItem(task, handlers) {
  const item = document.createElement("li");
  item.className = "task-item";

  const main = document.createElement("div");
  main.className = "task-main";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.setAttribute(
    "aria-label",
    task.completed ? `Mark ${task.title} as active` : `Mark ${task.title} as completed`,
  );
  checkbox.addEventListener("change", () => handlers.onToggle(task.id, checkbox.checked));

  const content = document.createElement("div");
  const title = document.createElement("span");
  title.className = `task-title${task.completed ? " completed" : ""}`;
  title.textContent = task.title;
  const meta = document.createElement("span");
  meta.className = "task-meta";
  meta.textContent = formatTaskMeta(task);

  content.append(title, meta);
  main.append(checkbox, content);

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const stateButton = document.createElement("button");
  stateButton.type = "button";
  stateButton.textContent = task.completed ? "Mark Active" : "Complete";
  stateButton.addEventListener("click", () =>
    handlers.onToggle(task.id, !task.completed),
  );
  actions.append(stateButton);

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "danger";
  deleteButton.textContent = "削除";
  deleteButton.addEventListener("click", () => handlers.onDelete(task.id));
  actions.append(deleteButton);

  item.append(main, actions);
  return item;
}

function createApp({ service, elements }) {
  const { form, titleInput, errorBox, list, emptyState, count } = elements;

  function render() {
    const tasks = service.listTasks();
    list.replaceChildren(
      ...tasks.map((task) =>
        renderTaskItem(task, {
          onToggle(taskId, completed) {
            if (completed) {
              service.completeTask(taskId);
            } else {
              service.activateTask(taskId);
            }
            render();
          },
          onDelete(taskId) {
            service.deleteTask(taskId);
            render();
          },
        }),
      ),
    );

    emptyState.hidden = tasks.length > 0;
    count.textContent = formatCount(tasks.length);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    errorBox.textContent = "";

    try {
      service.createTask(titleInput.value);
      form.reset();
      titleInput.focus();
      render();
    } catch (error) {
      if (error instanceof TaskValidationError) {
        errorBox.textContent = error.message;
        return;
      }

      throw error;
    }
  });

  render();
}

const repository = new LocalTaskRepository(window.localStorage);
const service = new TaskService(repository);

createApp({
  service,
  elements: {
    form: document.querySelector("#task-form"),
    titleInput: document.querySelector("#task-title"),
    errorBox: document.querySelector("#form-error"),
    list: document.querySelector("#task-list"),
    emptyState: document.querySelector("#empty-state"),
    count: document.querySelector("#task-count"),
  },
});
