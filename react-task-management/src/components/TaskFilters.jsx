function TaskFilters({ tasks, filter, onFilterChange }) {
  const allTasks = tasks.length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  return (
    <section className="task-filters">
      <h2>Task Filters</h2>
      <button className={filter === 'All' ? 'active' : ''} onClick={() => onFilterChange('All')}> All ({allTasks})</button>
      <button className={filter === 'Pending' ? 'active' : ''} onClick={() => onFilterChange('Pending')}> Pending ({pendingTasks})</button>
      <button className={filter === 'Completed' ? 'active' : ''} onClick={() => onFilterChange('Completed')}> Completed ({completedTasks}) </button>
    </section>
  );
}

export default TaskFilters;