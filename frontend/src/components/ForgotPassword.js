import React, { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgot = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot", { email });
      setMessage(res.data);
    } catch (err) {
      setMessage(err.response?.data || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleForgot} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h2>Forgot Password</h2>
      <input
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <button type="submit">Send Reset Link</button>
      {message && <div style={{ color: "green" }}>{message}</div>}
    </form>
  );
}

export default ForgotPassword;