import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import "./TaskDetails.css";

function TaskDetails() {
  const { taskId } = useParams();

  const tasks = useSelector((state) => state.tasks.tasks);

  const task = tasks.find(
    (item) =>
      String(item._id || item.id) === String(taskId)
  );

  if (!task) {
    return (
      <div className="task-details">
        <h2>Task Not Found</h2>
        <p>The task you are looking for does not exist.</p>

        <Link to="/tasks">Back to Tasks</Link>
      </div>
    );
  }

  return (
    <div className="task-details">
      <h1>{task.title}</h1>

      {task.description && (
        <p>{task.description}</p>
      )}

      <div className="task-details-info">
        <p>
          <strong>Status:</strong>{" "}
          {task.status || (task.completed ? "Completed" : "Pending")}
        </p>

        {task.priority && (
          <p>
            <strong>Priority:</strong> {task.priority}
          </p>
        )}

        {task.category && (
          <p>
            <strong>Category:</strong> {task.category}
          </p>
        )}

        {task.dueDate && (
          <p>
            <strong>Due Date:</strong> {task.dueDate}
          </p>
        )}
      </div>

      <Link to="/tasks">Back to Tasks</Link>
    </div>
  );
}

export default TaskDetails;