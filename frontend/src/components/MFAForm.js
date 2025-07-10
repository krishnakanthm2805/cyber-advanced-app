import React, { useState } from "react";
import axios from "axios";

function MFAForm({ userId, onAuthSuccess }) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleMFA = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/mfa", { userId, code });
      if (res.data.token) {
        onAuthSuccess(res.data.token);
      }
    } catch (err) {
      setMessage(err.response?.data || "Invalid code");
    }
  };

  return (
    <form onSubmit={handleMFA} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h2>Enter MFA Code</h2>
      <input
        placeholder="6-digit code"
        value={code}
        onChange={e => setCode(e.target.value)}
        required
      />
      <button type="submit">Verify</button>
      {message && <div style={{ color: "red" }}>{message}</div>}
    </form>
  );
}

export default MFAForm;