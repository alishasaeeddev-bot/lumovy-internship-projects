function TaskForm() {
  return (
    <section className="task-form">
      <h2>Add New Task</h2>

      <input type="text" placeholder="Enter task title"/>

      <select>
        <option>Select category</option>
        <option>Study</option>
        <option>Practice</option>
        <option>Work</option>
      </select>

      <select>
        <option>Select priority</option>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      <button>Add Task</button>
    </section>
  );
}

export default TaskForm;