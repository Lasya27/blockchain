import React, { useState } from "react";
import axios from "axios";

function VerifierDashboard() {
  const [txHash, setTxHash] = useState("");
  const [result, setResult] = useState(null);

  const verifyCertificate = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/verify/${txHash}`
      );
      setResult(res.data);
    } catch (err) {
      alert("Invalid Certificate");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="card">
      <h2>🔍 Verify Certificate</h2>

      <input
        type="text"
        placeholder="Enter Transaction Hash"
        onChange={(e) => setTxHash(e.target.value)}
      />

      <button className="btn" onClick={verifyCertificate}>
        Verify ✅
      </button>

      <button className="btn" onClick={handleLogout}>
        Logout 🚪
      </button>

      {result && (
        <div className="certificate">
          <h3>{result.message}</h3>
          <p style={{ fontSize: "12px" }}>{result.txHash}</p>
        </div>
      )}
    </div>
  );
}

export default VerifierDashboard;