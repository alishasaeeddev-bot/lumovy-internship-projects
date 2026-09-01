import { useContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeContext } from "./context/ThemeContext";
import AppLayout from "./layouts/AppLayout";

import { Navigate } from 'react-router-dom'; 
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import About from "./pages/About";
import TaskDetails from "./components/TaskDetails";
import NotFound from "./pages/NotFound";

function App() {
  const { theme } = useContext(ThemeContext);
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (!savedTasks) {
      return [];
    }

    return JSON.parse(savedTasks);
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask) => {
    setTasks((previousTasks) => [
      ...previousTasks,
      {
        ...newTask,
        id: Date.now(),
        completed: false,
      },
    ]);
  };

  const toggleTask = (id) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id)
    );
  };

  const updateTask = (updatedTask) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === updatedTask.id
          ? {
              ...task,
              title: updatedTask.title,
              category: updatedTask.category,
              priority: updatedTask.priority,
              dueDate: updatedTask.dueDate,
            }
          : task
      )
    );
  };

  return (
      <div className={`app ${theme}`}>
      <Navbar />
      <Routes>

        <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard tasks={tasks} />}/>
        <Route path="/tasks"
          element={
            <Tasks
              tasks={tasks}
              onAddTask={addTask}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/tasks/:taskId" element={<TaskDetails tasks={tasks} />}/>
        <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      </div>
  );
}

export default App;