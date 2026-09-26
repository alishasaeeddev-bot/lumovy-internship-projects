import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import {
  deleteTask,
  fetchTasks
} from "../features/tasks/tasksSlice";
import "./Tasks.css";

function Tasks() {
  const dispatch = useDispatch();

  const tasks = useSelector(
    (state) => state.tasks.tasks
  );

  const loading = useSelector(
    (state) => state.tasks.loading
  );

  const error = useSelector(
    (state) => state.tasks.error
  );

  const pagination = useSelector(
    (state) => state.tasks.pagination
  );

  const [editingTask, setEditingTask] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [priorityFilter, setPriorityFilter] =
    useState("all");

  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [sortBy, setSortBy] =
    useState("createdAt");

  const [sortOrder, setSortOrder] =
    useState("desc");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [taskToDelete, setTaskToDelete] =
    useState(null);

  const [deletingTask, setDeletingTask] =
    useState(false);

  const tasksPerPage = 10;

  useEffect(() => {
    dispatch(
      fetchTasks({
        search: searchTerm,
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
        sortBy,
        order: sortOrder,
        page: currentPage,
        limit: tasksPerPage
      })
    );
  }, [
    dispatch,
    searchTerm,
    statusFilter,
    priorityFilter,
    categoryFilter,
    sortBy,
    sortOrder,
    currentPage
  ]);

  const categories = useMemo(() => {
    const uniqueCategories = tasks
      .map((task) => task.category)
      .filter(Boolean);

    return [...new Set(uniqueCategories)];
  }, [tasks]);

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = (task) => {
    setTaskToDelete(task);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) {
      return;
    }

    try {
      setDeletingTask(true);

      await dispatch(
        deleteTask(taskToDelete._id)
      ).unwrap();

      if (
        tasks.length === 1 &&
        currentPage > 1
      ) {
        setCurrentPage(
          (page) => page - 1
        );
      }

      setTaskToDelete(null);
    } catch (error) {
      console.error(
        "Delete task error:",
        error
      );
    } finally {
      setDeletingTask(false);
    }
  };

  const cancelDelete = () => {
    if (deletingTask) {
      return;
    }

    setTaskToDelete(null);
  };

  const handleFormComplete = () => {
    setEditingTask(null);
    setShowForm(false);

    dispatch(
      fetchTasks({
        search: searchTerm,
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
        sortBy,
        order: sortOrder,
        page: currentPage,
        limit: tasksPerPage
      })
    );
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(
      event.target.value
    );
    setCurrentPage(1);
  };

  const handlePriorityChange = (event) => {
    setPriorityFilter(
      event.target.value
    );
    setCurrentPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategoryFilter(
      event.target.value
    );
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    const value = event.target.value;

    setCurrentPage(1);

    if (value === "newest") {
      setSortBy("createdAt");
      setSortOrder("desc");
    }

    if (value === "oldest") {
      setSortBy("createdAt");
      setSortOrder("asc");
    }

    if (value === "priority") {
      setSortBy("priority");
      setSortOrder("asc");
    }

    if (value === "dueDate") {
      setSortBy("dueDate");
      setSortOrder("asc");
    }

    if (value === "title") {
      setSortBy("title");
      setSortOrder("asc");
    }
  };

  const currentSortValue =
    sortBy === "createdAt" &&
    sortOrder === "desc"
      ? "newest"
      : sortBy === "createdAt" &&
        sortOrder === "asc"
        ? "oldest"
        : sortBy === "priority"
          ? "priority"
          : sortBy === "dueDate"
            ? "dueDate"
            : "title";

  const hasActiveFilters =
    searchTerm.trim() ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    categoryFilter !== "all" ||
    currentSortValue !== "newest";

  const hasNoTasks =
    pagination.totalTasks === 0 &&
    !hasActiveFilters;

  const hasNoMatchingTasks =
    tasks.length === 0 &&
    hasActiveFilters;

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div>
          <p className="tasks-label">
            WORKSPACE
          </p>

          <h1>My Tasks</h1>

          <p className="tasks-subtitle">
            Create, organize, and manage
            your tasks.
          </p>
        </div>

        <button
          type="button"
          className="add-task-button"
          onClick={handleAddTask}
        >
          + Add Task
        </button>
      </div>

      <div className="tasks-summary">
        <div className="summary-card">
          <span>Total Tasks</span>
          <strong>
            {pagination.totalTasks}
          </strong>
        </div>

        <div className="summary-card">
          <span>In Progress</span>
          <strong>
            {
              tasks.filter(
                (task) =>
                  task.status ===
                  "in-progress"
              ).length
            }
          </strong>
        </div>

        <div className="summary-card">
          <span>Completed</span>
          <strong>
            {
              tasks.filter(
                (task) =>
                  task.status ===
                  "completed"
              ).length
            }
          </strong>
        </div>

        <div className="summary-card">
          <span>High Priority</span>
          <strong>
            {
              tasks.filter(
                (task) =>
                  task.priority ===
                  "high"
              ).length
            }
          </strong>
        </div>
      </div>

      {showForm && (
        <div className="task-form-section">
          <TaskForm
            editingTask={editingTask}
            onEditComplete={
              handleFormComplete
            }
          />
        </div>
      )}

      <section className="tasks-content">
        <div className="tasks-content-header">
          <div>
            <h2>All Tasks</h2>

            <p>
              Showing {tasks.length} of{" "}
              {pagination.totalTasks} tasks
            </p>
          </div>
        </div>

        <div className="task-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={
                handleSearchChange
              }
            />
          </div>

          <div className="filter-controls">
            <select
              value={statusFilter}
              onChange={
                handleStatusChange
              }
            >
              <option value="all">
                All Statuses
              </option>

              <option value="todo">
                To Do
              </option>

              <option value="in-progress">
                In Progress
              </option>

              <option value="completed">
                Completed
              </option>
            </select>

            <select
              value={priorityFilter}
              onChange={
                handlePriorityChange
              }
            >
              <option value="all">
                All Priorities
              </option>

              <option value="high">
                High Priority
              </option>

              <option value="medium">
                Medium Priority
              </option>

              <option value="low">
                Low Priority
              </option>
            </select>

            <select
              value={categoryFilter}
              onChange={
                handleCategoryChange
              }
            >
              <option value="all">
                All Categories
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                )
              )}
            </select>

            <select
              value={currentSortValue}
              onChange={
                handleSortChange
              }
            >
              <option value="newest">
                Newest First
              </option>

              <option value="oldest">
                Oldest First
              </option>

              <option value="priority">
                Highest Priority
              </option>

              <option value="dueDate">
                Due Date
              </option>

              <option value="title">
                Title
              </option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                className="clear-filters-button"
                onClick={clearFilters}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="tasks-message">
            <div className="tasks-loading-spinner"></div>

            <h3>
              Loading tasks
            </h3>

            <p>
              Please wait while your
              tasks are being loaded.
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="tasks-message error-message">
            <div className="tasks-message-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
            </div>

            <h3>
              Unable to load tasks
            </h3>

            <p>{error}</p>

            <button
              type="button"
              className="tasks-retry-button"
              onClick={() =>
                dispatch(
                  fetchTasks({
                    search: searchTerm,
                    status:
                      statusFilter,
                    priority:
                      priorityFilter,
                    category:
                      categoryFilter,
                    sortBy,
                    order: sortOrder,
                    page: currentPage,
                    limit:
                      tasksPerPage
                  })
                )
              }
            >
              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          hasNoTasks && (
            <div className="tasks-empty-state">
              <div className="tasks-empty-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H17a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6.5A2.5 2.5 0 0 1 4 18.5z" />
                  <path d="M8 8h7" />
                  <path d="M8 12h7" />
                  <path d="M8 16h4" />
                </svg>
              </div>

              <h3>
                Your task list is empty
              </h3>

              <p>
                Create your first task to
                start organizing your work
                and tracking your progress.
              </p>

              <button
                type="button"
                className="tasks-empty-action"
                onClick={handleAddTask}
              >
                Create Your First Task
              </button>
            </div>
          )}

        {!loading &&
          !error &&
          hasNoMatchingTasks && (
            <div className="tasks-empty-state">
              <div className="tasks-empty-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                  />
                  <path d="m16.5 16.5 4 4" />
                  <path d="M8.5 11h5" />
                </svg>
              </div>

              <h3>
                No matching tasks
              </h3>

              <p>
                No tasks match your current
                search or filter settings.
              </p>

              <button
                type="button"
                className="tasks-empty-action secondary"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          )}

        {!loading &&
          !error &&
          tasks.length > 0 && (
            <TaskList
              tasks={tasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

        {!loading &&
          !error &&
          pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                disabled={
                  !pagination.hasPreviousPage
                }
                onClick={() =>
                  setCurrentPage(
                    (page) => page - 1
                  )
                }
              >
                Previous
              </button>

              <span>
                Page{" "}
                {pagination.currentPage}{" "}
                of{" "}
                {pagination.totalPages}
              </span>

              <button
                type="button"
                disabled={
                  !pagination.hasNextPage
                }
                onClick={() =>
                  setCurrentPage(
                    (page) => page + 1
                  )
                }
              >
                Next
              </button>
            </div>
          )}
      </section>

      {taskToDelete && (
        <div
          className="delete-modal-overlay"
          onMouseDown={cancelDelete}
        >
          <div
            className="delete-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="delete-modal-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v5" />
                <path d="M14 11v5" />
              </svg>
            </div>

            <h3>Delete task?</h3>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                "{taskToDelete.title}"
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-cancel-button"
                onClick={cancelDelete}
                disabled={deletingTask}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-confirm-button"
                onClick={confirmDelete}
                disabled={deletingTask}
              >
                {deletingTask
                  ? "Deleting..."
                  : "Delete Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
