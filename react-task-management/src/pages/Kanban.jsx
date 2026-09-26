import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { updateTask } from "../features/tasks/tasksSlice";
import "./Kanban.css";

const columns = [
  {
    id: "todo",
    title: "To Do",
    description: "Tasks waiting to be started",
  },
  {
    id: "in-progress",
    title: "In Progress",
    description: "Tasks currently being worked on",
  },
  {
    id: "completed",
    title: "Completed",
    description: "Finished tasks",
  },
];

function Kanban() {
  const dispatch = useDispatch();

  const tasks = useSelector(
    (state) => state.tasks.tasks
  );

  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => {
      const taskStatus =
        task.status ||
        (task.completed ? "completed" : "todo");

      return taskStatus === status;
    });
  };

  const handleDragStart = (event) => {
    const task = tasks.find(
      (item) =>
        String(item._id || item.id) ===
        String(event.active.id)
    );

    setActiveTask(task || null);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) {
      return;
    }

    const task = tasks.find(
      (item) =>
        String(item._id || item.id) ===
        String(active.id)
    );

    if (!task) {
      return;
    }

    const newStatus = String(over.id);

    const validStatuses = [
      "todo",
      "in-progress",
      "completed",
    ];

    if (!validStatuses.includes(newStatus)) {
      return;
    }

    const currentStatus =
      task.status ||
      (task.completed ? "completed" : "todo");

    if (currentStatus === newStatus) {
      return;
    }

    try {
      await dispatch(
        updateTask({
          id: task._id || task.id,
          title: task.title,
          description: task.description || "",
          priority: task.priority || "medium",
          status: newStatus,
          category: task.category || "General",
          tags: task.tags || [],
          dueDate: task.dueDate || null,
        })
      ).unwrap();
    } catch (error) {
      console.error(
        "Failed to update task status:",
        error
      );
    }
  };

  return (
    <div className="kanban-page">
      <div className="kanban-header">
        <div>
          <p className="kanban-label">
            WORKSPACE
          </p>

          <h1>Kanban Board</h1>

          <p className="kanban-subtitle">
            Organize your tasks visually and track
            your progress.
          </p>
        </div>

        <Link
          to="/tasks"
          className="kanban-action"
        >
          Manage Tasks
        </Link>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-board">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={getTasksByStatus(column.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <KanbanTask
              task={activeTask}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function KanbanColumn({ column, tasks }) {
  const { setNodeRef, isOver } =
    useDroppable({
      id: column.id,
    });

  return (
    <div
      ref={setNodeRef}
      className={`kanban-column ${
        isOver ? "kanban-column-over" : ""
      }`}
    >
      <div className="kanban-column-header">
        <div>
          <h2>{column.title}</h2>

          <p>{column.description}</p>
        </div>

        <span className="kanban-count">
          {tasks.length}
        </span>
      </div>

      <div className="kanban-column-content">
        {tasks.length === 0 ? (
          <div className="kanban-empty">
            <p>Drop tasks here</p>
          </div>
        ) : (
          tasks.map((task) => (
            <KanbanTask
              key={task._id || task.id}
              task={task}
            />
          ))
        )}
      </div>
    </div>
  );
}

function KanbanTask({
  task,
  isDragging = false,
}) {
  const taskId = String(
    task._id || task.id
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: currentlyDragging,
  } = useDraggable({
    id: taskId,
  });

  const priority =
    task.priority || "medium";

  const formattedPriority =
    priority.charAt(0).toUpperCase() +
    priority.slice(1);

  const formattedDueDate =
    task.dueDate
      ? new Date(
          task.dueDate
        ).toLocaleDateString()
      : "No due date";

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`kanban-task ${
        isDragging || currentlyDragging
          ? "kanban-task-dragging"
          : ""
      }`}
      {...listeners}
      {...attributes}
    >
      <div className="kanban-task-top">
        <span
          className={`kanban-priority ${priority}`}
        >
          {formattedPriority}
        </span>
      </div>

      <h3>{task.title}</h3>

      {task.description && (
        <p className="kanban-task-description">
          {task.description}
        </p>
      )}

      {task.category && (
        <span className="kanban-category">
          {task.category}
        </span>
      )}

      {Array.isArray(task.tags) &&
        task.tags.length > 0 && (
          <div className="kanban-tags">
            {task.tags
              .slice(0, 3)
              .map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                >
                  {tag}
                </span>
              ))}
          </div>
        )}

      <div className="kanban-task-footer">
        <span>{formattedDueDate}</span>

        <Link
          to={`/tasks/${taskId}`}
          onPointerDown={(event) =>
            event.stopPropagation()
          }
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          View
        </Link>
      </div>
    </div>
  );
}

export default Kanban;
