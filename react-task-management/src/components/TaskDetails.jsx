import { useParams } from "react-router-dom";

function TaskDetails({ tasks }) {
  const { taskId } = useParams();

  const task = tasks.find((task) => task.id.toString() === taskId);

  if (!task) {
    return <h1>Task Not Found</h1>;
  }

  return (
    <main>
      <h1>{task.title}</h1>
      <p>Category: {task.category}</p>
      <p>Priority: {task.priority}</p>
      <p>Due Date: {task.dueDate}</p>
      <p>Status: {task.completed ? "Completed" : "Pending"}</p>
    </main>
  );
}

export default TaskDetails;