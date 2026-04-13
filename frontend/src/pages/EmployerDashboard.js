import React, { useState } from "react";
import axios from "axios";

function EmployerDashboard() {
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
    <div>
      <h2>Employer Verification</h2>

      <input
        type="text"
        placeholder="Enter Transaction Hash"
        onChange={(e) => setTxHash(e.target.value)}
      />

      <button onClick={verifyCertificate}>
        Verify
      </button>

      <button className="btn" onClick={handleLogout}>
        Logout 🚪
      </button>

      {result && (
        <div>
          <p>{result.message}</p>
          <p>{result.txHash}</p>
        </div>
      )}
    </div>
  );
}

export default EmployerDashboard;