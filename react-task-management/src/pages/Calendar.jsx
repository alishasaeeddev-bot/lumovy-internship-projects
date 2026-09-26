import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import "./Calendar.css";

function Calendar() {
  const tasks = useSelector((state) => state.tasks.tasks);
  const navigate = useNavigate();

  const calendarEvents = tasks
    .filter((task) => task.dueDate)
    .map((task) => {
      const taskId = task._id || task.id;
      const priority = task.priority || "medium";

      return {
        id: String(taskId),
        title: task.title,
        date: task.dueDate,
        className: `calendar-task-${priority}`,
        extendedProps: {
          status: task.status || "todo",
          priority,
          category: task.category || "General",
        },
      };
    });

  const handleEventClick = (info) => {
    const taskId = info.event.id;
    navigate(`/tasks/${taskId}`);
  };

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <div>
          <p className="calendar-label">
            WORKSPACE
          </p>

          <h1>Calendar</h1>

          <p className="calendar-subtitle">
            View and manage your tasks by their due dates.
          </p>
        </div>

        <Link
          to="/tasks"
          className="calendar-action"
        >
          Manage Tasks
        </Link>
      </div>

      <section className="calendar-card">
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
          ]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
          }}
          height="auto"
          events={calendarEvents}
          eventClick={handleEventClick}
          dayMaxEvents={3}
          nowIndicator={true}
        />

        <div className="calendar-legend">
          <span className="calendar-legend-title">
            Priority
          </span>

          <div className="calendar-legend-item">
            <span className="calendar-legend-dot high"></span>
            High
          </div>

          <div className="calendar-legend-item">
            <span className="calendar-legend-dot medium"></span>
            Medium
          </div>

          <div className="calendar-legend-item">
            <span className="calendar-legend-dot low"></span>
            Low
          </div>
        </div>
      </section>
    </div>
  );
}

export default Calendar;