import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTasks } from "../features/tasks/taskSelectors";
import "./Dashboard.css";
function Dashboard() {
  const tasks = useSelector(selectTasks);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  return (
    <main className="dashboard-page">
      <div className="dashboard-header">
        <p className="dashboard-label">OVERVIEW</p>

        <h1>Task Dashboard</h1>

        <p>
          Track your tasks, monitor your progress, and stay organized.
        </p>
      </div>

      <section className="dashboard-stats">
        <div className="stat-card">
          <p>Total Tasks</p>
          <h2>{totalTasks}</h2>
        </div>

        <div className="stat-card">
          <p>Pending Tasks</p>
          <h2>{pendingTasks}</h2>
        </div>

        <div className="stat-card">
          <p>Completed Tasks</p>
          <h2>{completedTasks}</h2>
        </div>
      </section>

      <section className="progress-section">
        <div className="progress-header">
          <h2>Task Progress</h2>
          <span>{progress}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p>
          {completedTasks} of {totalTasks} tasks completed.
        </p>
      </section>

      <section className="dashboard-actions">
        <h2>Manage Your Tasks</h2>

        <p>
          Add new tasks, update existing tasks, or manage your completed
          tasks.
        </p>

        <Link to="/tasks" className="dashboard-button">
          Manage Tasks
        </Link>
      </section>
    </main>
  );
}

export default Dashboard;