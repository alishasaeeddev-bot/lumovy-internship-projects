import TaskCard from './TaskCard';

function TaskList({ tasks, onToggleTask, onDeleteTask, onEditTask }) {
  return (
    <section className="task-list">
      <h2>Tasks</h2>

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
        />
      ))}
    </section>
  );
}

export default TaskList;