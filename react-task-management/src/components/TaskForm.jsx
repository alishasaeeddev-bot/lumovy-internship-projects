import { useEffect, useRef, useState } from "react";

function TaskForm({ onAddTask, editingTask, onUpdateTask }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");

  const titleInputRef = useRef(null);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setCategory(editingTask.category);
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate || "");
      titleInputRef.current.focus();
    }
  }, [editingTask]);

  const handleSubmit = () => {
    if (title.trim() === "") {
      alert("Please enter a task title");
      return;
    }

    const taskData = {
      title: title,
      category: category,
      priority: priority,
      dueDate: dueDate
    };

    if (editingTask) {
      onUpdateTask({
        ...taskData,
        id: editingTask.id
      });
    } else {
      onAddTask(taskData);
    }

    setTitle("");
    setCategory("");
    setPriority("");
    setDueDate("");
  };

  return (
    <section className="task-form">
      <h2>{editingTask ? "Update Task" : "Add New Task"}</h2>

      <input ref={titleInputRef} type="text" placeholder="Enter task title" value={title} onChange={(e) => setTitle(e.target.value)}/>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select category</option>
        <option value="Study">Study</option>
        <option value="Practice">Practice</option>
        <option value="Work">Work</option>
      </select>

      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="">Select priority</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}/>
      
      <button onClick={handleSubmit}> {editingTask ? "Update Task" : "Add Task"}</button>
    </section>
  );
}

export default TaskForm;