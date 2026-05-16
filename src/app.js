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
  checkbox.disabled = task.completed;
  checkbox.setAttribute("aria-label", `Mark ${task.title} as completed`);
  checkbox.addEventListener("change", () => handlers.onComplete(task.id));

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

  if (!task.completed) {
    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.textContent = "Complete";
    completeButton.addEventListener("click", () => handlers.onComplete(task.id));
    actions.append(completeButton);
  }

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "danger";
  deleteButton.textContent = "Delete";
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
          onComplete(taskId) {
            service.completeTask(taskId);
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
