import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const navigate = useNavigate();

  const handleRegister = async () => {
    const res = await axios.post("http://localhost:5000/register", {
      email,
      password,
      role
    });

    alert(res.data);
    navigate("/");
  };

  return (
    <div>
      <h2>Register</h2>

      <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />

      <select onChange={(e)=>setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="issuer">Issuer</option>
        <option value="verifier">Verifier</option>
      </select>

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;