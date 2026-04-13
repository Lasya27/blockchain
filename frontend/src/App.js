import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import IssuerDashboard from "./pages/IssuerDashboard";
import VerifierDashboard from "./pages/VerifierDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="navbar">
        <h2>🎓 CertifyChain</h2>

        <div className="nav-links">
          <Link to="/">Issue</Link>
          <Link to="/verify">Verify</Link>
          <Link to="/student">Student</Link>
          
        </div>
      </div>

      <div className="hero">
        <h1>Blockchain Certificate System</h1>
        <p>Secure • Tamper-proof • Instant Verification</p>
      </div>

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/student" element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        } />

        <Route path="/verify" element={<VerifierDashboard />} />
      </Routes>

      <div className="footer">
        © 2026 CertifyChain 🚀
      </div>
    </Router>
  );
}

export default App;