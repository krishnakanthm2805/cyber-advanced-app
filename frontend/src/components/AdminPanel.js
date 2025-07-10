import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminPanel({ token }) {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [tab, setTab] = useState("users");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (tab === "users") {
      axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setUsers(res.data)).catch(err => setMessage("Not authorized"));
    } else {
      axios.get("http://localhost:5000/api/admin/logs", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setLogs(res.data)).catch(err => setMessage("Not authorized"));
    }
  }, [tab, token]);

  return (
    <div>
      <h2>Admin Panel</h2>
      <button onClick={() => setTab("users")}>Users</button>
      <button onClick={() => setTab("logs")}>Logs</button>
      {tab === "users" ? (
        <table border="1" style={{ marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Verified</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.verified ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table border="1" style={{ marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>ID</th><th>User ID</th><th>Action</th><th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.user_id}</td>
                <td>{l.action}</td>
                <td>{l.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {message && <div style={{ color: "red" }}>{message}</div>}
    </div>
  );
}

export default AdminPanel;