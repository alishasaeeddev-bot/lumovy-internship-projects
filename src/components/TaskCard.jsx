function TaskCard({ task }) {
  return (
    <article className="task-card">
      <h3>{task.title}</h3>
      <p>Category: {task.category}</p>
      <p>Priority: {task.priority}</p>
      <p>Status: {task.completed ? 'Completed' : 'Active'}</p>
      <p>Due: {task.dueDate}</p>
    </article>
  );
}

export default TaskCard;