import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "High" && !task.completed
  ).length;

  return (
    <main className="dashboard-page">

      <section className="dashboard-header">
        <p className="dashboard-label">OVERVIEW</p>
        <h1>Task Dashboard</h1>
        <p>Get a quick overview of your tasks and progress.</p>
      </section>

      <section className="dashboard-stats">
        <article className="stat-card">
          <p>Total Tasks</p>
          <h2>{totalTasks}</h2>
        </article>

        <article className="stat-card">
          <p>Pending Tasks</p>
          <h2>{pendingTasks}</h2>
        </article>

        <article className="stat-card">
          <p>Completed Tasks</p>
          <h2>{completedTasks}</h2>
        </article>

        <article className="stat-card">
          <p>High Priority</p>
          <h2>{highPriorityTasks}</h2>
        </article>

      </section>

      <section className="progress-section">

        <div className="progress-header">
          <h2>Task Progress</h2>
          <span>{completionPercentage}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>

        <p>{completedTasks} of {totalTasks} tasks completed.</p>
      </section>

      <section className="dashboard-actions">
        <h2>Manage Your Tasks</h2>
        <p> Add new tasks, update existing tasks, or mark tasks as completed.</p>
        <Link to="/tasks" className="dashboard-button">Go to Tasks</Link>
      </section>

    </main>
  );
}

export default Dashboard;