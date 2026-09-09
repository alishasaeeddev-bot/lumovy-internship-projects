import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggleTask, deleteTask } from "../features/tasks/tasksSlice";

function TaskCard({ task, onEditTask }) {
  const dispatch = useDispatch();

  return (
    <article className="task-card">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => dispatch(toggleTask(task.id))}
      />

      <Link to={`/tasks/${task.id}`}><h3>{task.title}</h3></Link>

      <p>Category: {task.category}</p>
      <p>Priority: {task.priority}</p>
      <p>Status: {task.completed ? "Completed" : "Pending"}</p>
      <p>Due: {task.dueDate}</p>

      {!task.completed && (
        <button onClick={() => onEditTask(task)}> Update </button>
      )}

      {task.completed && (
        <button onClick={() => dispatch(toggleTask(task.id))}> Undo </button>
      )}

      <button onClick={() => dispatch(deleteTask(task.id))}> Delete </button>
    </article>
  );
}

export default TaskCard;