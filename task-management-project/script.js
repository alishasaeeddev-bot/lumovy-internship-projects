const STORAGE_KEY = "taskManagementApp_v2";

const DEFAULT_TASKS = [
  {
    id: "task-1",
    title: "Complete JavaScript Assignment",
    category: "Study",
    priority: "Medium",
    dueDate: "2026-08-12",
    completed: false
  },
  {
    id: "task-2",
    title: "Prepare Presentation",
    category: "University",
    priority: "High",
    dueDate: "2026-08-15",
    completed: false
  },
  {
    id: "task-3",
    title: "Recreate Table Image",
    category: "Design",
    priority: "High",
    dueDate: "2026-08-29",
    completed: true
  },
  {
    id: "task-4",
    title: "Study Javascript Loops",
    category: "Learning",
    priority: "High",
    dueDate: "2026-08-30",
    completed: true
  },
  {
    id: "task-5",
    title: "GitHub Project Upload",
    category: "Development",
    priority: "High",
    dueDate: "2026-08-18",
    completed: false
  }
];

function generateId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);

      if (Array.isArray(parsedTasks)) {
        return parsedTasks;
      }
    }
  } catch (error) {
    console.error("Unable to load tasks:", error);
  }

  return DEFAULT_TASKS.map(task => ({ ...task }));
}

function saveTasks() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(appState.tasks)
  );
}

const appState = {
  tasks: loadTasks(),
  filter: "all",
  search: "",
  sort: "default",
  editingTaskId: null
};

const elements = {
  taskList: document.getElementById("taskList"),
  taskCount: document.getElementById("taskCount"),
  totalCount: document.getElementById("totalCount"),
  completedCount: document.getElementById("completedCount"),
  pendingCount: document.getElementById("pendingCount"),
  progressText: document.getElementById("progressText"),
  progressBar: document.querySelector(".progress-bar"),
  progressFill: document.querySelector(".progress-fill"),
  filterButtons: document.querySelectorAll(".filter-btn"),
  allFilterCount: document.getElementById("allFilterCount"),
  pendingFilterCount: document.getElementById("pendingFilterCount"),
  completedFilterCount: document.getElementById("completedFilterCount"),
  searchInput: document.getElementById("searchInput"),
  sortSelect: document.getElementById("sortSelect"),
  openFormBtn: document.getElementById("openFormBtn"),
  taskModal: document.getElementById("taskModal"),
  closeModalBtn: document.getElementById("closeModalBtn"),
  modalTitle: document.getElementById("modalTitle"),
  taskForm: document.getElementById("taskForm"),
  taskTitle: document.getElementById("taskTitle"),
  taskCategory: document.getElementById("taskCategory"),
  taskPriority: document.getElementById("taskPriority"),
  taskDate: document.getElementById("taskDate"),
  formMessage: document.getElementById("formMessage"),
  submitTaskBtn: document.getElementById("submitTaskBtn"),
  cancelEditBtn: document.getElementById("cancelEditBtn"),
  calculator: document.getElementById("calculator"),
  calculatorDisplay: document.getElementById("calculatorDisplay")
};

function formatCategory(category) {
  return category || "General";
}

function formatPriority(priority) {
  return priority || "Medium";
}

function formatDate(date) {
  if (!date) {
    return "No due date";
  }

  const dateObject = new Date(`${date}T00:00:00`);

  return dateObject.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function isTaskOverdue(task) {
  if (task.completed || !task.dueDate) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(`${task.dueDate}T00:00:00`);

  return dueDate < today;
}

function getStatistics() {
  const total = appState.tasks.length;

  const completed = appState.tasks.filter(
    task => task.completed
  ).length;

  const pending = total - completed;

  const percentage = total
    ? Math.round((completed / total) * 100)
    : 0;

  return {
    total,
    completed,
    pending,
    percentage
  };
}

function getVisibleTasks() {
  let tasks = [...appState.tasks];

  if (appState.filter === "completed") {
    tasks = tasks.filter(task => task.completed);
  }

  if (appState.filter === "pending") {
    tasks = tasks.filter(task => !task.completed);
  }

  if (appState.search) {
    const search = appState.search.toLowerCase();

    tasks = tasks.filter(task =>
      task.title.toLowerCase().includes(search) ||
      task.category.toLowerCase().includes(search) ||
      task.priority.toLowerCase().includes(search)
    );
  }

  if (appState.sort === "dueDate") {
    tasks.sort(
      (a, b) =>
        new Date(a.dueDate) - new Date(b.dueDate)
    );
  }

  if (appState.sort === "title") {
    tasks.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }

  if (appState.sort === "priority") {
    const priorityOrder = {
      High: 1,
      Medium: 2,
      Low: 3
    };

    tasks.sort(
      (a, b) =>
        priorityOrder[a.priority] -
        priorityOrder[b.priority]
    );
  }

  return tasks;
}

function createTaskCard(task) {
  const card = document.createElement("article");

  card.className = "task-card";

  if (task.completed) {
    card.classList.add("is-completed");
  }

  const title = document.createElement("h3");
  title.textContent = task.title;

  const meta = document.createElement("div");
  meta.className = "task-meta";

  const category = document.createElement("span");
  category.className = "category";
  category.textContent = formatCategory(task.category);

  const priority = document.createElement("span");
  priority.className = "priority";
  priority.textContent =
    `${formatPriority(task.priority)} Priority`;

  meta.append(category, priority);

  const dueDate = document.createElement("p");

  dueDate.className = "due-date";

  dueDate.textContent =
    `Due: ${formatDate(task.dueDate)}`;

  if (isTaskOverdue(task)) {
    dueDate.classList.add("overdue");
    dueDate.textContent += " (Overdue)";
  }

  const actions = document.createElement("div");

  actions.className = "task-actions";

  const statusButton = document.createElement("button");

  statusButton.type = "button";
  statusButton.className =
    task.completed ? "status completed" : "status";

  statusButton.dataset.action = "toggle";
  statusButton.dataset.id = task.id;

  statusButton.setAttribute(
    "aria-pressed",
    task.completed
  );

  statusButton.textContent =
    task.completed ? "Completed" : "Pending";

  const editButton = document.createElement("button");

  editButton.type = "button";
  editButton.className = "edit-btn";
  editButton.dataset.action = "edit";
  editButton.dataset.id = task.id;
  editButton.textContent = "Edit";

  const deleteButton = document.createElement("button");

  deleteButton.type = "button";
  deleteButton.className = "delete-btn";
  deleteButton.dataset.action = "delete";
  deleteButton.dataset.id = task.id;
  deleteButton.textContent = "Delete";

  actions.append(
    statusButton,
    editButton,
    deleteButton
  );

  card.append(
    title,
    meta,
    dueDate,
    actions
  );

  return card;
}

function renderTaskList() {
  const tasks = getVisibleTasks();

  elements.taskList.innerHTML = "";

  if (!tasks.length) {
    const emptyState = document.createElement("div");

    emptyState.className = "empty-state";

    if (appState.search) {
      emptyState.textContent =
        "No tasks found for your search.";
    } else if (appState.filter === "completed") {
      emptyState.textContent =
        "No completed tasks.";
    } else if (appState.filter === "pending") {
      emptyState.textContent =
        "No pending tasks.";
    } else {
      emptyState.textContent =
        "No tasks available.";
    }

    elements.taskList.appendChild(emptyState);
  } else {
    tasks.forEach(task => {
      elements.taskList.appendChild(
        createTaskCard(task)
      );
    });
  }

  elements.taskCount.textContent =
    `${tasks.length} ${
      tasks.length === 1 ? "Task" : "Tasks"
    }`;
}

function updateStatistics() {
  const {
    total,
    completed,
    pending,
    percentage
  } = getStatistics();

  elements.totalCount.textContent = total;
  elements.completedCount.textContent = completed;
  elements.pendingCount.textContent = pending;

  elements.progressText.textContent =
    `${percentage}% Complete`;

  elements.progressFill.style.width =
    `${percentage}%`;

  elements.progressBar.setAttribute(
    "aria-valuenow",
    percentage
  );

  elements.allFilterCount.textContent = total;
  elements.pendingFilterCount.textContent = pending;
  elements.completedFilterCount.textContent = completed;
}

function updateActiveFilter() {
  elements.filterButtons.forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.filter === appState.filter
    );
  });
}

function refreshTaskUI() {
  renderTaskList();
  updateStatistics();
  updateActiveFilter();
}

function showFormMessage(
  message,
  type = "error"
) {
  elements.formMessage.textContent = message;

  elements.formMessage.className =
    `form-message ${type}`;
}

function clearFormMessage() {
  elements.formMessage.textContent = "";
  elements.formMessage.className = "form-message";
}

function getTaskFormData() {
  return {
    title: elements.taskTitle.value.trim(),
    category: elements.taskCategory.value,
    priority: elements.taskPriority.value,
    dueDate: elements.taskDate.value
  };
}

function validateTaskForm(task) {
  if (!task.title) {
    return "Please enter a task title.";
  }

  if (task.title.length < 3) {
    return "Task title must contain at least 3 characters.";
  }

  if (!task.category) {
    return "Please select a category.";
  }

  if (!task.priority) {
    return "Please select a priority.";
  }

  if (!task.dueDate) {
    return "Please select a due date.";
  }

  return "";
}

function resetTaskForm() {
  elements.taskForm.reset();

  appState.editingTaskId = null;

  elements.submitTaskBtn.textContent =
    "Add Task";

  elements.cancelEditBtn.hidden = true;

  elements.modalTitle.textContent =
    "Add New Task";

  clearFormMessage();
}

function openTaskModal() {
  elements.taskModal.classList.add("active");
  elements.taskTitle.focus();
}

function closeTaskModal() {
  elements.taskModal.classList.remove("active");
  resetTaskForm();
}

function handleTaskSubmit(event) {
  event.preventDefault();

  const taskData = getTaskFormData();

  const validationMessage =
    validateTaskForm(taskData);

  if (validationMessage) {
    showFormMessage(validationMessage);
    return;
  }

  if (appState.editingTaskId) {
    const task = appState.tasks.find(
      task =>
        task.id === appState.editingTaskId
    );

    if (task) {
      Object.assign(task, taskData);
      showFormMessage(
        "Task updated successfully.",
        "success"
      );
    }
  } else {
    appState.tasks.push({
      id: generateId(),
      ...taskData,
      completed: false
    });

    showFormMessage(
      "Task added successfully.",
      "success"
    );
  }

  saveTasks();
  refreshTaskUI();

  setTimeout(() => {
    closeTaskModal();
  }, 500);
}

function startEditTask(id) {
  const task = appState.tasks.find(
    task => task.id === id
  );

  if (!task) {
    return;
  }

  appState.editingTaskId = id;

  elements.taskTitle.value = task.title;
  elements.taskCategory.value = task.category;
  elements.taskPriority.value = task.priority;
  elements.taskDate.value = task.dueDate;

  elements.submitTaskBtn.textContent =
    "Update Task";

  elements.cancelEditBtn.hidden = false;

  elements.modalTitle.textContent =
    "Edit Task";

  clearFormMessage();

  openTaskModal();
}

function deleteTask(id) {
  const task = appState.tasks.find(
    task => task.id === id
  );

  if (!task) {
    return;
  }

  const confirmed = confirm(
    `Delete "${task.title}"?`
  );

  if (!confirmed) {
    return;
  }

  appState.tasks = appState.tasks.filter(
    task => task.id !== id
  );

  if (appState.editingTaskId === id) {
    resetTaskForm();
  }

  saveTasks();
  refreshTaskUI();
}

function toggleTask(id) {
  const task = appState.tasks.find(
    task => task.id === id
  );

  if (!task) {
    return;
  }

  task.completed = !task.completed;

  saveTasks();
  refreshTaskUI();
}

elements.openFormBtn.addEventListener(
  "click",
  openTaskModal
);

elements.closeModalBtn.addEventListener(
  "click",
  closeTaskModal
);

elements.cancelEditBtn.addEventListener(
  "click",
  closeTaskModal
);

elements.taskModal.addEventListener(
  "click",
  event => {
    if (event.target === elements.taskModal) {
      closeTaskModal();
    }
  }
);

elements.taskForm.addEventListener(
  "submit",
  handleTaskSubmit
);

elements.taskList.addEventListener(
  "click",
  event => {
    const button =
      event.target.closest("[data-action]");

    if (!button) {
      return;
    }

    const { action, id } = button.dataset;

    if (action === "toggle") {
      toggleTask(id);
    }

    if (action === "edit") {
      startEditTask(id);
    }

    if (action === "delete") {
      deleteTask(id);
    }
  }
);

elements.filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    appState.filter =
      button.dataset.filter;

    refreshTaskUI();
  });
});

elements.searchInput.addEventListener(
  "input",
  event => {
    appState.search =
      event.target.value.trim();

    renderTaskList();
  }
);

elements.sortSelect.addEventListener(
  "change",
  event => {
    appState.sort =
      event.target.value;

    renderTaskList();
  }
);

function appendToDisplay(value) {
  elements.calculatorDisplay.value += value;
}

function clearDisplay() {
  elements.calculatorDisplay.value = "";
}

function isValidExpression(expression) {
  return /^[0-9+\-*/().\s]+$/.test(
    expression
  );
}

function calculateExpression(expression) {
  if (
    !expression ||
    !isValidExpression(expression)
  ) {
    throw new Error("Invalid expression");
  }

  return Function(
    `"use strict"; return (${expression})`
  )();
}

function calculate() {
  try {
    const expression =
      elements.calculatorDisplay.value;

    const result =
      calculateExpression(expression);

    if (!Number.isFinite(result)) {
      throw new Error("Invalid result");
    }

    elements.calculatorDisplay.value =
      result;
  } catch {
    elements.calculatorDisplay.value =
      "Error";
  }
}

elements.calculator.addEventListener(
  "click",
  event => {
    const button =
      event.target.closest("button");

    if (!button) {
      return;
    }

    if (
      button.dataset.action === "clear"
    ) {
      clearDisplay();
      return;
    }

    if (
      button.dataset.action === "calculate"
    ) {
      calculate();
      return;
    }

    if (button.dataset.value) {
      if (
        elements.calculatorDisplay.value ===
        "Error"
      ) {
        clearDisplay();
      }

      appendToDisplay(
        button.dataset.value
      );
    }
  }
);

document.addEventListener(
  "keydown",
  event => {
    const activeElement =
      document.activeElement;

    const tagName =
      activeElement.tagName;

    if (
      ["INPUT", "SELECT", "TEXTAREA"]
        .includes(tagName)
    ) {
      return;
    }

    if (
      /^[0-9+\-*/().]$/.test(event.key)
    ) {
      appendToDisplay(event.key);
    }

    if (event.key === "Enter") {
      calculate();
    }

    if (event.key === "Escape") {
      clearDisplay();
    }
  }
);

refreshTaskUI();
