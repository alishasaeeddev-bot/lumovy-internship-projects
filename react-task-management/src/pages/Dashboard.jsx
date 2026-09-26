import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTaskDeadlineStatus } from "../utils/taskDeadline";
import { fetchTasks } from "../features/tasks/tasksSlice";
import "./Dashboard.css";

function Dashboard() {
  const dispatch = useDispatch();

  const {
    tasks,
    loading,
    error,
  } = useSelector((state) => state.tasks);

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) =>
      task.status === "completed" ||
      task.completed === true
  ).length;

  const inProgressTasks = tasks.filter(
    (task) =>
      task.status === "in-progress"
  ).length;

  const pendingTasks = tasks.filter(
    (task) =>
      task.status === "todo" ||
      task.status === "pending" ||
      (!task.status && !task.completed)
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "high"
  ).length;

  const mediumPriorityTasks = tasks.filter(
    (task) => task.priority === "medium"
  ).length;

  const lowPriorityTasks = tasks.filter(
    (task) => task.priority === "low"
  ).length;

  const activeTasks = tasks.filter(
    (task) =>
      task.status !== "completed" &&
      task.completed !== true
  );

  const overdueTasks = activeTasks.filter(
    (task) => {
      const deadline =
        getTaskDeadlineStatus(
          task.dueDate
        );

      return deadline.status === "overdue";
    }
  );

  const dueTodayTasks = activeTasks.filter(
    (task) => {
      const deadline =
        getTaskDeadlineStatus(
          task.dueDate
        );

      return deadline.status === "today";
    }
  );

  const upcomingTasks = activeTasks.filter(
    (task) => {
      const deadline =
        getTaskDeadlineStatus(
          task.dueDate
        );

      return (
        deadline.status === "tomorrow" ||
        deadline.status === "soon" ||
        deadline.status === "upcoming"
      );
    }
  );

  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks /
            totalTasks) *
            100
        );

  const activeTaskCount =
    totalTasks - completedTasks;

  const activeTaskRate =
    totalTasks === 0
      ? 0
      : Math.round(
          (activeTaskCount /
            totalTasks) *
            100
        );

  const highPriorityRate =
    totalTasks === 0
      ? 0
      : Math.round(
          (highPriorityTasks /
            totalTasks) *
            100
        );

  const completedRate =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks /
            totalTasks) *
            100
        );

  const inProgressRate =
    totalTasks === 0
      ? 0
      : Math.round(
          (inProgressTasks /
            totalTasks) *
            100
        );

  const pendingRate =
    totalTasks === 0
      ? 0
      : Math.round(
          (pendingTasks /
            totalTasks) *
            100
        );

  const recentTasks = [...tasks]
    .slice(-5)
    .reverse();

  if (loading && tasks.length === 0) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="dashboard-loading-header">
            <div>
              <span className="skeleton skeleton-label"></span>
              <span className="skeleton skeleton-title"></span>
              <span className="skeleton skeleton-subtitle"></span>
            </div>

            <span className="skeleton skeleton-button"></span>
          </div>

          <div className="dashboard-loading-stats">
            {Array.from(
              { length: 4 },
              (_, index) => (
                <div
                  className="dashboard-loading-card"
                  key={index}
                >
                  <span className="skeleton skeleton-small"></span>
                  <span className="skeleton skeleton-number"></span>
                  <span className="skeleton skeleton-text"></span>
                </div>
              )
            )}
          </div>

          <div className="dashboard-loading-deadlines">
            {Array.from(
              { length: 3 },
              (_, index) => (
                <div
                  className="dashboard-loading-card"
                  key={index}
                >
                  <span className="skeleton skeleton-small"></span>
                  <span className="skeleton skeleton-number"></span>
                  <span className="skeleton skeleton-text"></span>
                </div>
              )
            )}
          </div>

          <div className="dashboard-loading-grid">
            <div className="dashboard-loading-panel">
              <span className="skeleton skeleton-section-title"></span>
              <span className="skeleton skeleton-section-text"></span>

              <div className="skeleton-list">
                {Array.from(
                  { length: 3 },
                  (_, index) => (
                    <div
                      className="skeleton-list-item"
                      key={index}
                    >
                      <span className="skeleton skeleton-text"></span>
                      <span className="skeleton skeleton-bar"></span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="dashboard-loading-panel">
              <span className="skeleton skeleton-section-title"></span>
              <span className="skeleton skeleton-section-text"></span>

              <div className="dashboard-loading-circle">
                <span className="skeleton skeleton-circle"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && tasks.length === 0) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <div className="dashboard-error-icon">
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

          <h2>
            Unable to load dashboard
          </h2>

          <p>{error}</p>

          <button
            type="button"
            className="dashboard-retry"
            onClick={() =>
              dispatch(
                fetchTasks({
                  page: 1,
                  limit: 100
                })
              )
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-label">
            WORKSPACE
          </p>

          <h1>Dashboard</h1>

          <p className="dashboard-subtitle">
            Track your tasks, progress, and
            productivity.
          </p>
        </div>

        <Link
          to="/tasks"
          className="dashboard-action"
        >
          View My Tasks
        </Link>
      </div>

      <section className="dashboard-stats">
        <div className="stat-card">
          <span>Total Tasks</span>
          <strong>{totalTasks}</strong>
          <small>All your tasks</small>
        </div>

        <div className="stat-card">
          <span>Completed</span>
          <strong>{completedTasks}</strong>
          <small>
            {completionRate}%
            completion rate
          </small>
        </div>

        <div className="stat-card">
          <span>In Progress</span>
          <strong>
            {inProgressTasks}
          </strong>
          <small>
            Currently working
          </small>
        </div>

        <div className="stat-card">
          <span>High Priority</span>
          <strong>
            {highPriorityTasks}
          </strong>
          <small>
            Needs attention
          </small>
        </div>
      </section>

      <section className="dashboard-deadlines">
        <div className="deadline-card">
          <span>Overdue</span>
          <strong>
            {overdueTasks.length}
          </strong>
          <small>
            Past deadline
          </small>
        </div>

        <div className="deadline-card">
          <span>Due Today</span>
          <strong>
            {dueTodayTasks.length}
          </strong>
          <small>
            Needs attention today
          </small>
        </div>

        <div className="deadline-card">
          <span>Upcoming</span>
          <strong>
            {upcomingTasks.length}
          </strong>
          <small>
            Future deadlines
          </small>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>
                Task Overview
              </h2>

              <p>
                Your current task
                distribution.
              </p>
            </div>
          </div>

          <div className="overview-list">
            <div className="overview-item">
              <div>
                <span>
                  Completed
                </span>

                <strong>
                  {completedTasks}
                </strong>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${completedRate}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="overview-item">
              <div>
                <span>
                  In Progress
                </span>

                <strong>
                  {inProgressTasks}
                </strong>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${inProgressRate}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="overview-item">
              <div>
                <span>
                  Pending
                </span>

                <strong>
                  {pendingTasks}
                </strong>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${pendingRate}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>
                Productivity
              </h2>

              <p>
                Your overall completion
                progress.
              </p>
            </div>
          </div>

          <div className="productivity">
            <div
              className="productivity-circle"
              style={{
                "--progress": `${completionRate}%`
              }}
            >
              <div className="productivity-circle-inner">
                <strong>
                  {completionRate}%
                </strong>

                <span>
                  Complete
                </span>
              </div>
            </div>

            <div className="productivity-info">
              <p>
                You have completed{" "}
                <strong>
                  {completedTasks}
                </strong>{" "}
                out of{" "}
                <strong>
                  {totalTasks}
                </strong>{" "}
                tasks.
              </p>

              <Link to="/tasks">
                Manage Tasks
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="analytics-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>
                Task Distribution
              </h2>

              <p>
                Breakdown of your
                current workload.
              </p>
            </div>
          </div>

          <div className="analytics-list">
            <div className="analytics-item">
              <div className="analytics-item-header">
                <span>
                  Completed
                </span>

                <strong>
                  {completedTasks} (
                  {completedRate}%)
                </strong>
              </div>

              <div className="analytics-bar">
                <div
                  className="analytics-bar-fill"
                  style={{
                    width: `${completedRate}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="analytics-item">
              <div className="analytics-item-header">
                <span>
                  In Progress
                </span>

                <strong>
                  {inProgressTasks} (
                  {inProgressRate}%)
                </strong>
              </div>

              <div className="analytics-bar">
                <div
                  className="analytics-bar-fill"
                  style={{
                    width: `${inProgressRate}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="analytics-item">
              <div className="analytics-item-header">
                <span>
                  Pending
                </span>

                <strong>
                  {pendingTasks} (
                  {pendingRate}%)
                </strong>
              </div>

              <div className="analytics-bar">
                <div
                  className="analytics-bar-fill"
                  style={{
                    width: `${pendingRate}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>
                Priority Distribution
              </h2>

              <p>
                Breakdown of task
                priorities.
              </p>
            </div>
          </div>

          <div className="priority-list">
            <div className="priority-row">
              <div>
                <span className="priority-indicator high"></span>
                <span>High</span>
              </div>

              <strong>
                {highPriorityTasks}
              </strong>
            </div>

            <div className="priority-row">
              <div>
                <span className="priority-indicator medium"></span>
                <span>Medium</span>
              </div>

              <strong>
                {mediumPriorityTasks}
              </strong>
            </div>

            <div className="priority-row">
              <div>
                <span className="priority-indicator low"></span>
                <span>Low</span>
              </div>

              <strong>
                {lowPriorityTasks}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-card insights-card">
        <div className="card-header">
          <div>
            <h2>
              Productivity Insights
            </h2>

            <p>
              A quick overview of
              your current workload.
            </p>
          </div>
        </div>

        <div className="insights-grid">
          <div className="insight-item">
            <span>
              Active Tasks
            </span>

            <strong>
              {activeTaskCount}
            </strong>

            <small>
              {activeTaskRate}% of
              total tasks
            </small>
          </div>

          <div className="insight-item">
            <span>
              High Priority
            </span>

            <strong>
              {highPriorityTasks}
            </strong>

            <small>
              {highPriorityRate}% of
              total tasks
            </small>
          </div>

          <div className="insight-item">
            <span>
              Deadline Risk
            </span>

            <strong>
              {overdueTasks.length +
                dueTodayTasks.length}
            </strong>

            <small>
              Overdue or due today
            </small>
          </div>

          <div className="insight-item">
            <span>
              Upcoming
            </span>

            <strong>
              {upcomingTasks.length}
            </strong>

            <small>
              Tasks with future
              deadlines
            </small>
          </div>
        </div>
      </section>

      <section className="dashboard-card recent-tasks">
        <div className="card-header">
          <div>
            <h2>
              Recent Tasks
            </h2>

            <p>
              Your latest tasks.
            </p>
          </div>

          <Link to="/tasks">
            View All
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <div className="empty-dashboard">
            <h3>
              No tasks yet
            </h3>

            <p>
              Create your first task
              to start tracking your
              productivity.
            </p>

            <Link to="/tasks">
              Create Task
            </Link>
          </div>
        ) : (
          <div className="recent-task-list">
            {recentTasks.map(
              (task) => {
                const deadline =
                  getTaskDeadlineStatus(
                    task.dueDate
                  );

                const isCompleted =
                  task.status ===
                    "completed" ||
                  task.completed === true;

                return (
                  <div
                    className="recent-task"
                    key={
                      task._id ||
                      task.id
                    }
                  >
                    <div>
                      <h3>
                        {task.title}
                      </h3>

                      <div className="task-meta">
                        {task.priority && (
                          <span>
                            {
                              task.priority
                            }
                          </span>
                        )}

                        {task.category && (
                          <span>
                            {
                              task.category
                            }
                          </span>
                        )}

                        {!isCompleted &&
                          deadline.status !==
                            "none" && (
                            <span
                              className={`deadline-status ${deadline.status}`}
                            >
                              {
                                deadline.label
                              }
                            </span>
                          )}
                      </div>
                    </div>

                    <span
                      className={`task-status ${
                        task.status ||
                        (task.completed
                          ? "completed"
                          : "pending")
                      }`}
                    >
                      {task.status ||
                        (task.completed
                          ? "Completed"
                          : "Pending")}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
