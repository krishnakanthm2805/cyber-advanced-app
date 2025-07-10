import React, { useState } from "react";
import axios from "axios";

function ResetPassword({ token }) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/reset/${token}`, { password });
      setMessage(res.data);
    } catch (err) {
      setMessage(err.response?.data || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
      {message && <div style={{ color: "green" }}>{message}</div>}
    </form>
  );
}

export default ResetPassword;