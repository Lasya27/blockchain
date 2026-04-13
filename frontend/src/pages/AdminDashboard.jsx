import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("http://localhost:5000/users");
      setUsers(res.data);
    };

    fetchUsers();
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };
  }, []);

  return (
    <div className="card">
      <h2>👨‍💼 Admin Dashboard</h2>

      <h3>Registered Users</h3>

      {users.map((user, index) => (
        <div key={index} className="certificate">
          <p><b>Email:</b> {user.email}</p>
          <p><b>Role:</b> {user.role}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;