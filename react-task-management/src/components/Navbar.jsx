import { useContext, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import NotificationBell from "./NotificationBell";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { clearTasks } from "../features/tasks/tasksSlice";
import "./Navbar.css";

function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { logout } = useAuth();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(clearTasks());

    logout();

    setMenuOpen(false);

    navigate("/login", {
      replace: true
    });
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-top">
          <NavLink
            to="/dashboard"
            className="nav-brand"
            onClick={closeMenu}
            aria-label="Go to dashboard"
          >
            TaskFlow
          </NavLink>

          <div className="mobile-nav-actions">
            <NotificationBell />

            <button
              type="button"
              className="mobile-menu-button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={
                menuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={menuOpen}
              aria-controls="main-navigation"
            >
              {menuOpen ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div
          id="main-navigation"
          className={`navbar-content ${
            menuOpen ? "mobile-open" : ""
          }`}
        >
          <div className="nav-links">
            <NavLink
              to="/dashboard"
              onClick={closeMenu}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/tasks"
              onClick={closeMenu}
            >
              My Tasks
            </NavLink>

            <NavLink
              to="/kanban"
              onClick={closeMenu}
            >
              Kanban
            </NavLink>

            <NavLink
              to="/calendar"
              onClick={closeMenu}
            >
              Calendar
            </NavLink>

            <NavLink
              to="/profile"
              onClick={closeMenu}
            >
              Profile
            </NavLink>
          </div>

          <div className="nav-actions">
            <div className="desktop-notification">
              <NotificationBell />
            </div>

            <button
              type="button"
              className="theme-button"
              onClick={toggleTheme}
              aria-label={`Switch to ${
                theme === "light" ? "dark" : "light"
              } mode`}
            >
              {theme === "light"
                ? "Dark Mode"
                : "Light Mode"}
            </button>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
              aria-label="Log out of TaskFlow"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;