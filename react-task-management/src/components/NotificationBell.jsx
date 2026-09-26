import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./NotificationBell.css";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const notificationRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      await api.get(
        "/notifications/check-deadlines"
      );

      const response = await api.get(
        "/notifications"
      );

      setNotifications(
        response.data.notifications || []
      );

      setUnreadCount(
        response.data.unreadCount || 0
      );
    } catch (error) {
      console.error(
        "Fetch notifications error:",
        error.response?.data?.message ||
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleToggle = () => {
    setIsOpen((previous) => !previous);

    if (!isOpen) {
      fetchNotifications();
    }
  };

  const handleNotificationClick = async (
    notification
  ) => {
    try {
      if (!notification.isRead) {
        await api.put(
          `/notifications/${notification._id}/read`
        );

        setNotifications((previous) =>
          previous.map((item) =>
            item._id === notification._id
              ? {
                  ...item,
                  isRead: true,
                }
              : item
          )
        );

        setUnreadCount((previous) =>
          Math.max(previous - 1, 0)
        );
      }

      if (notification.task) {
        setIsOpen(false);

        navigate(
          `/tasks/${notification.task}`
        );
      }
    } catch (error) {
      console.error(
        "Read notification error:",
        error.response?.data?.message ||
          error.message
      );
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put(
        "/notifications/read-all"
      );

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Mark all read error:",
        error.response?.data?.message ||
          error.message
      );
    }
  };

  const handleDelete = async (
    event,
    notificationId
  ) => {
    event.stopPropagation();

    try {
      const notification =
        notifications.find(
          (item) =>
            item._id === notificationId
        );

      await api.delete(
        `/notifications/${notificationId}`
      );

      setNotifications((previous) =>
        previous.filter(
          (item) =>
            item._id !== notificationId
        )
      );

      if (
        notification &&
        !notification.isRead
      ) {
        setUnreadCount((previous) =>
          Math.max(previous - 1, 0)
        );
      }
    } catch (error) {
      console.error(
        "Delete notification error:",
        error.response?.data?.message ||
          error.message
      );
    }
  };

  const formatNotificationTime = (
    createdAt
  ) => {
    const date = new Date(createdAt);

    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="notification-wrapper"
      ref={notificationRef}
    >
      <button
        type="button"
        className="notification-button"
        onClick={handleToggle}
        aria-label="Notifications"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <div>
              <h3>Notifications</h3>

              <p>
                {unreadCount === 0
                  ? "No unread notifications"
                  : `${unreadCount} unread ${
                      unreadCount === 1
                        ? "notification"
                        : "notifications"
                    }`}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                className="mark-all-button"
                onClick={handleMarkAllRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-list">
            {loading &&
            notifications.length === 0 ? (
              <div className="notification-empty">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>

                <strong>
                  No notifications
                </strong>

                <span>
                  Your task activity will
                  appear here.
                </span>
              </div>
            ) : (
              notifications.map(
                (notification) => (
                  <div
                    key={notification._id}
                    className={`notification-item ${
                      notification.isRead
                        ? "read"
                        : "unread"
                    }`}
                    onClick={() =>
                      handleNotificationClick(
                        notification
                      )
                    }
                  >
                    <div className="notification-status">
                      {!notification.isRead && (
                        <span className="unread-dot"></span>
                      )}
                    </div>

                    <div className="notification-content">
                      <p>
                        {notification.message}
                      </p>

                      <span>
                        {formatNotificationTime(
                          notification.createdAt
                        )}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="notification-delete"
                      onClick={(event) =>
                        handleDelete(
                          event,
                          notification._id
                        )
                      }
                      aria-label="Delete notification"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v5" />
                        <path d="M14 11v5" />
                      </svg>
                    </button>
                  </div>
                )
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;