import React, { useState } from "react";
import AuthForm from "./components/AuthForm";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import AdminPanel from "./components/AdminPanel";

function App() {
  const [token, setToken] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Parse hash for navigation (simple routing)
  const hash = window.location.hash.replace("#", "");

  // Decode JWT to check for admin
  React.useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setIsAdmin(payload.role === "admin");
      } catch {}
    }
  }, [token]);

  if (hash.startsWith("reset/")) {
    const tokenParam = hash.split("/")[1];
    return <ResetPassword token={tokenParam} />;
  }
  if (hash === "forgot") return <ForgotPassword />;
  if (token && isAdmin) return <AdminPanel token={token} />;
  if (token) return <h2>Welcome! You are logged in.</h2>;

  return <AuthForm onAuthSuccess={setToken} />;
}

export default App;