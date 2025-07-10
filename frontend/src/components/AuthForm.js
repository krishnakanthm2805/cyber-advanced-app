import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import MFAForm from "./MFAForm";

const formVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

function AuthForm({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showMFA, setShowMFA] = useState(false);
  const [mfaUserId, setMfaUserId] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", { username, email, password });
      setMessage(res.data);
    } catch (err) {
      setMessage(err.response?.data || "Registration failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { username, password });
      if (res.data.mfa) {
        setShowMFA(true);
        setMfaUserId(res.data.userId);
      } else if (res.data.token) {
        onAuthSuccess(res.data.token);
      }
    } catch (err) {
      setMessage(err.response?.data || "Login failed");
    }
  };

  if (showMFA)
    return <MFAForm userId={mfaUserId} onAuthSuccess={onAuthSuccess} />;

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.form
          key={isLogin ? "login" : "signup"}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={formVariants}
          transition={{ duration: 0.4 }}
          onSubmit={isLogin ? handleLogin : handleRegister}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
            {isLogin ? "Login" : "Sign Up"}
          </h2>
          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          {!isLogin && (
            <input
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">
            {isLogin ? "Login" : "Sign Up"}
          </button>
          <span
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: "#66a6ff", cursor: "pointer", textAlign: "center" }}
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </span>
          <span
            onClick={() => window.location.hash = "#forgot"}
            style={{ color: "#888", cursor: "pointer", textAlign: "center" }}
          >
            Forgot password?
          </span>
          {message && <div style={{ color: "green", textAlign: "center" }}>{message}</div>}
        </motion.form>
      </AnimatePresence>
    </div>
  );
}

export default AuthForm;