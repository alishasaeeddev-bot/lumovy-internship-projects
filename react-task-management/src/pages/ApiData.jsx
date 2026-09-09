import { useEffect, useState } from "react";
import axios from "axios";

function ApiData() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  let interval = null

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");
      
    // await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await axios.get("https://jsonplaceholder.typicode.com/users");

      setUsers(response.data);
    } catch (error) {
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  }
  console.log("here")

  useEffect(() => {
    console.log("here2")
    interval  = setTimeout(() => {
      loadUsers();
    }, 1000);

    return () => {
      console.log("here3" );
      clearTimeout(interval);
    }

  }, []);

  return (
    <div>
      <h1>API Data</h1>

      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <div>
          <p>{error}</p>
          <button onClick={() => loadUsers()}> Try Again</button>
        </div>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        users.map((user) => (
          <div key={user.id}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>{user.address?.city}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ApiData;