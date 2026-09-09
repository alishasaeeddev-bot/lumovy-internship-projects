import TaskCard from "./TaskCard";

function TaskList({ tasks, onEditTask }) {
  return (
    <section className="task-list">
      <h2>Tasks</h2>

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEditTask={onEditTask}
        />
      ))}
    </section>
  );
}

export default TaskList;