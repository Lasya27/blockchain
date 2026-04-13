import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password
      });

      localStorage.setItem("userEmail", email);
      localStorage.setItem("role", res.data.role);

      alert("Login Success ✅");

      if (res.data.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/student";
      }

    } catch {
      alert("Login Failed ❌");
    }
  };

  return (
    <div className="card">
      <h2>🔐 Login</h2>

      <input
        type="text"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default Login;