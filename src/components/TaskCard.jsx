import { Link } from "react-router-dom";
function TaskCard({ task, onToggleTask, onDeleteTask, onEditTask }) {
  return (
    <article className="task-card">
      <input type="checkbox" checked={task.completed} onChange={() => onToggleTask(task.id)}/>
      <Link to={`/tasks/${task.id}`}>
        <h3>{task.title}</h3>
      </Link>
      <p>Category: {task.category}</p>
      <p>Priority: {task.priority}</p>
      <p>Status: {task.completed ? 'Completed' : 'Pending'}</p>
      <p>Due: {task.dueDate}</p>

      {!task.completed && (
        <button onClick={() => onEditTask(task)}> Update </button>
      )}

      {task.completed && (<button onClick={() => onToggleTask(task.id)}> Undo </button>
      )}

      <button onClick={() => onDeleteTask(task.id)}> Delete </button>
    </article>
  );
}

export default TaskCard;