
import { Link } from "react-router-dom";
import { getTaskDeadlineStatus } from "../utils/taskDeadline";
import "./TaskCard.css";

function TaskCard({ task, onEdit, onDelete }) {
  const taskId = task._id || task.id;

  const taskStatus =
    task.status || (task.completed ? "completed" : "todo");

  const formattedStatus =
    taskStatus === "in-progress"
      ? "In Progress"
      : taskStatus === "completed"
      ? "Completed"
      : "To Do";

  const formattedPriority =
    task.priority?.charAt(0).toUpperCase() +
      task.priority?.slice(1) || "Medium";

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date";

  const deadline = getTaskDeadlineStatus(task.dueDate);

  return (
    <article className="task-card">
      <div className="task-card-header">
        <div>
          <h3>{task.title}</h3>

          {task.category && (
            <span className="task-category">
              {task.category}
            </span>
          )}
        </div>

        <span className={`task-priority ${task.priority}`}>
          {formattedPriority}
        </span>
      </div>

      {task.description && (
        <p className="task-description">
          {task.description}
        </p>
      )}

      {Array.isArray(task.tags) && task.tags.length > 0 && (
        <div className="task-tags">
          {task.tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="task-tag"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="task-card-info">
        <div>
          <span className="info-label">Status</span>

          <span className={`task-status ${taskStatus}`}>
            {formattedStatus}
          </span>
        </div>

        <div>
          <span className="info-label">Due Date</span>

          <span>{formattedDueDate}</span>

          {deadline.status !== "none" && (
            <span
              className={`task-deadline ${deadline.status}`}
            >
              {deadline.label}
            </span>
          )}
        </div>
      </div>

      <div className="task-card-actions">
        <Link to={`/tasks/${taskId}`}>
          View Details
        </Link>

        <button
          type="button"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(task)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskCard;