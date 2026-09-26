import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import "./Header.css";

function Header() {
    const { theme } = useContext(ThemeContext);

    return (
        <header className={`app-header ${theme}`}>
            <div className="header-content">
                <h1>Task Management App</h1>
                <p>Organize your tasks efficiently</p>
            </div>
        </header>
    );
}

export default Header;