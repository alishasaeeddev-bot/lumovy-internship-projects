import { useState } from "react";
import { useSelector } from "react-redux";

import TaskForm from "../components/TaskForm";
import TaskFilters from "../components/TaskFilters";
import TaskList from "../components/Tasklist";
import EmptyState from "../components/EmptyState";

import { selectTasks } from "../features/tasks/taskSelectors";

function Tasks() {
  const [filter, setFilter] = useState("All");
  const [editingTask, setEditingTask] = useState(null);

  const tasks = useSelector(selectTasks);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Pending") {
      return !task.completed;
    }

    if (filter === "Completed") {
      return task.completed;
    }

    return true;
  });

  const handleEditComplete = () => {
    setEditingTask(null);
  };

  return (
    <main className="tasks-page">
      <TaskForm
        editingTask={editingTask}
        onEditComplete={handleEditComplete}
      />

      <TaskFilters
        filter={filter}
        onFilterChange={setFilter}
      />

      <TaskList
        tasks={filteredTasks}
        onEditTask={setEditingTask}
      />

      {tasks.length === 0 && <EmptyState />}
    </main>
  );
}

export default Tasks;