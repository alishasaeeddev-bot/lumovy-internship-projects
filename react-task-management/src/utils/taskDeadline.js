export function getTaskDeadlineStatus(dueDate) {
  if (!dueDate) {
    return {
      status: "none",
      label: "No deadline"
    };
  }

  const today = new Date();
  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const difference =
    due.getTime() - today.getTime();

  const daysRemaining =
    Math.ceil(difference / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return {
      status: "overdue",
      label: "Overdue",
      daysRemaining
    };
  }

  if (daysRemaining === 0) {
    return {
      status: "today",
      label: "Due today",
      daysRemaining: 0
    };
  }

  if (daysRemaining === 1) {
    return {
      status: "tomorrow",
      label: "Due tomorrow",
      daysRemaining: 1
    };
  }

  if (daysRemaining <= 3) {
    return {
      status: "soon",
      label: `Due in ${daysRemaining} days`,
      daysRemaining
    };
  }

  return {
    status: "upcoming",
    label: `Due in ${daysRemaining} days`,
    daysRemaining
  };
}