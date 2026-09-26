import { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import "./Footer.css";

function Footer() {
    const { theme } = useContext(ThemeContext);

    return (
        <footer className={`footer ${theme}`}>
            <div className="footer-content">
                <div className="footer-brand">
                    <span className="footer-logo">TaskFlow</span>
                    <span className="footer-tagline">
                        Organize. Track. Complete.
                    </span>
                </div>

                <nav className="footer-nav">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/tasks">Tasks</Link>
                    <Link to="/kanban">Kanban</Link>
                    <Link to="/calendar">Calendar</Link>
                </nav>

                <div className="footer-status">
                    <span className="status-dot"></span>
                    <span>All systems operational</span>
                </div>

                <div className="footer-copy">
                    © {new Date().getFullYear()} Alisha Saeed
                </div>
            </div>
        </footer>
    );
}

export default Footer;