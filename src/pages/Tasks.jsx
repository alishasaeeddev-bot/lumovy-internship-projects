import { useState } from "react";

import Header from "../components/Header";
import TaskForm from "../components/TaskForm";
import TaskFilters from "../components/TaskFilters";
import TaskList from "../components/Tasklist";
import EmptyState from "../components/EmptyState";

function Tasks({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
}) {
  const [filter, setFilter] = useState("All");
  const [editingTask, setEditingTask] = useState(null);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Pending") {
      return !task.completed;
    }

    if (filter === "Completed") {
      return task.completed;
    }

    return true;
  });

  return (
    <main className="tasks-page">
      <TaskForm onAddTask={onAddTask} editingTask={editingTask} onUpdateTask={onUpdateTask}/>
      <TaskFilters tasks={tasks} filter={filter} onFilterChange={setFilter}/>
      <TaskList tasks={filteredTasks} onToggleTask={onToggleTask} onDeleteTask={onDeleteTask} onEditTask={setEditingTask}/>
      {tasks.length === 0 && <EmptyState />}
    </main>
  );
}

export default Tasks;