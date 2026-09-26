import { useEffect, useState } from "react";
import axios from "axios";
import "./ApiData.css";

function ApiData() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );

      setUsers(response.data);
    } catch (error) {
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadUsers();
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="api-data-page">
      <div className="api-data-header">
        <div>
          <p className="api-data-label">
            API INTEGRATION
          </p>

          <h1>API Data</h1>

          <p className="api-data-subtitle">
            Fetch and display user data from a REST API.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="api-data-message">
          <div className="api-loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : error ? (
        <div className="api-data-message api-data-error">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>

          <p>{error}</p>

          <button
            type="button"
            onClick={loadUsers}
          >
            Try Again
          </button>
        </div>
      ) : users.length === 0 ? (
        <div className="api-data-message">
          <p>No users found.</p>
        </div>
      ) : (
        <div className="api-users-grid">
          {users.map((user) => (
            <article
              className="api-user-card"
              key={user.id}
            >
              <div className="api-user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div className="api-user-content">
                <h2>{user.name}</h2>

                <p className="api-user-email">
                  {user.email}
                </p>

                <div className="api-user-location">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>

                  <span>
                    {user.address?.city || "Unknown city"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default ApiData;
