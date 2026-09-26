import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  addTask,
  updateTask
} from "../features/tasks/tasksSlice";
import "./TaskForm.css";

function TaskForm({ editingTask, onEditComplete }) {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("todo");
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const titleInputRef = useRef(null);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setPriority(editingTask.priority || "medium");
      setStatus(editingTask.status || "todo");
      setCategory(editingTask.category || "General");

      setTags(
        Array.isArray(editingTask.tags)
          ? editingTask.tags.join(", ")
          : ""
      );

      setDueDate(
        editingTask.dueDate
          ? new Date(editingTask.dueDate)
              .toISOString()
              .slice(0, 16)
          : ""
      );

      setErrors({});
      titleInputRef.current?.focus();
    }
  }, [editingTask]);

  const resetForm = () => {
    setTitle("");
    setPriority("");
    setStatus("todo");
    setCategory("General");
    setTags("");
    setDueDate("");
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    const trimmedTitle = title.trim();
    const trimmedCategory = category.trim();

    if (!trimmedTitle) {
      newErrors.title = "Task title is required.";
    } else if (trimmedTitle.length < 3) {
      newErrors.title =
        "Task title must be at least 3 characters.";
    } else if (trimmedTitle.length > 100) {
      newErrors.title =
        "Task title cannot exceed 100 characters.";
    }

    if (!priority) {
      newErrors.priority =
        "Please select a priority.";
    }

    if (!trimmedCategory) {
      newErrors.category =
        "Category cannot be empty.";
    } else if (trimmedCategory.length > 50) {
      newErrors.category =
        "Category cannot exceed 50 characters.";
    }

    const formattedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    const uniqueTags = [
      ...new Set(formattedTags.map((tag) => tag.toLowerCase()))
    ];

    if (uniqueTags.length > 10) {
      newErrors.tags =
        "You can add a maximum of 10 tags.";
    }

    if (formattedTags.some((tag) => tag.length > 30)) {
      newErrors.tags =
        "Each tag must be 30 characters or less.";
    }

    if (dueDate) {
      const selectedDate = new Date(dueDate);

      if (Number.isNaN(selectedDate.getTime())) {
        newErrors.dueDate =
          "Please enter a valid due date.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleTitleChange = (event) => {
    const value = event.target.value;

    setTitle(value);

    if (errors.title) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        title: ""
      }));
    }
  };

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);

    if (errors.priority) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        priority: ""
      }));
    }
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;

    setCategory(value);

    if (errors.category) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        category: ""
      }));
    }
  };

  const handleTagsChange = (event) => {
    setTags(event.target.value);

    if (errors.tags) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        tags: ""
      }));
    }
  };

  const handleDueDateChange = (event) => {
    setDueDate(event.target.value);

    if (errors.dueDate) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        dueDate: ""
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    const formattedTags = [
      ...new Set(
        tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "")
      )
    ];

    const taskData = {
      title: title.trim(),
      priority,
      status,
      category: category.trim() || "General",
      tags: formattedTags,
      dueDate: dueDate || null
    };

    try {
      setSaving(true);

      if (editingTask) {
        await dispatch(
          updateTask({
            id: editingTask._id,
            ...taskData
          })
        ).unwrap();

        onEditComplete();
      } else {
        await dispatch(
          addTask(taskData)
        ).unwrap();

        resetForm();
      }
    } catch (error) {
      console.error(
        "Task save error:",
        error
      );

      setErrors({
        form:
          error?.message ||
          "Unable to save the task. Please try again."
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="task-form">
      <h2>
        {editingTask
          ? "Update Task"
          : "Add New Task"}
      </h2>

      {errors.form && (
        <div className="task-form-error">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
            />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>

          <span>{errors.form}</span>
        </div>
      )}

      <div className="task-form-field">
        <label htmlFor="task-title">
          Task Title
        </label>

        <input
          id="task-title"
          ref={titleInputRef}
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={handleTitleChange}
          className={
            errors.title
              ? "input-error"
              : ""
          }
          maxLength={100}
        />

        {errors.title && (
          <p className="field-error">
            {errors.title}
          </p>
        )}
      </div>

      <div className="task-form-field">
        <label htmlFor="task-priority">
          Priority
        </label>

        <select
          id="task-priority"
          value={priority}
          onChange={handlePriorityChange}
          className={
            errors.priority
              ? "input-error"
              : ""
          }
        >
          <option value="" disabled>
            Select Priority
          </option>

          <option value="low">
            Low Priority
          </option>

          <option value="medium">
            Medium Priority
          </option>

          <option value="high">
            High Priority
          </option>
        </select>

        {errors.priority && (
          <p className="field-error">
            {errors.priority}
          </p>
        )}
      </div>

      <div className="task-form-field">
        <label htmlFor="task-status">
          Status
        </label>

        <select
          id="task-status"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
        >
          <option value="todo">
            To Do
          </option>

          <option value="in-progress">
            In Progress
          </option>

          <option value="completed">
            Completed
          </option>
        </select>
      </div>

      <div className="task-form-field">
        <label htmlFor="task-category">
          Category
        </label>

        <input
          id="task-category"
          type="text"
          placeholder="Category (e.g. Development)"
          value={category}
          onChange={handleCategoryChange}
          className={
            errors.category
              ? "input-error"
              : ""
          }
          maxLength={50}
        />

        {errors.category && (
          <p className="field-error">
            {errors.category}
          </p>
        )}
      </div>

      <div className="task-form-field">
        <label htmlFor="task-tags">
          Tags
        </label>

        <input
          id="task-tags"
          type="text"
          placeholder="Tags (e.g. React, Node.js, MongoDB)"
          value={tags}
          onChange={handleTagsChange}
        />

        <p className="field-hint">
          Separate multiple tags with commas.
        </p>

        {errors.tags && (
          <p className="field-error">
            {errors.tags}
          </p>
        )}
      </div>

      <div className="task-form-field">
        <label htmlFor="task-due-date">
          Due Date
        </label>

        <input
          id="task-due-date"
          type="datetime-local"
          value={dueDate}
          onChange={handleDueDateChange}
          className={
            errors.dueDate
              ? "input-error"
              : ""
          }
        />

        {errors.dueDate && (
          <p className="field-error">
            {errors.dueDate}
          </p>
        )}
      </div>

      <div className="task-form-actions">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving
            ? editingTask
              ? "Updating..."
              : "Adding..."
            : editingTask
              ? "Update Task"
              : "Add Task"}
        </button>

        {editingTask && (
          <button
            type="button"
            onClick={() => {
              if (saving) {
                return;
              }

              resetForm();
              onEditComplete();
            }}
            disabled={saving}
          >
            Cancel
          </button>
        )}
      </div>
    </section>
  );
}

export default TaskForm;