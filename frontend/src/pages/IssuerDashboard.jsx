import React, { useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


function IssuerDashboard() {
  const [studentName, setStudentName] = useState("");
  const [course, setCourse] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [qrData, setQrData] = useState("");

  // ✅ Issue Certificate
  const issueCertificate = async () => {
    try {
      const res = await axios.post("http://localhost:5000/issue", {
        studentName,
        course,
        walletAddress,
      });

      setQrData(res.data.txHash);
      alert("Certificate Issued Successfully!");
    } catch (err) {
      alert("Error issuing certificate");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // ✅ Download PDF (High Quality)
  const downloadPDF = async () => {
    const element = document.getElementById("certificate");

    const canvas = await html2canvas(element, {
      scale: 2,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape");
    pdf.addImage(imgData, "PNG", 10, 10, 270, 150);
    pdf.save("certificate.pdf");
  };

  return (
    <div className="card">
      <h2>🎓 Issue Certificate</h2>

      <input
        type="text"
        placeholder="Student Name"
        onChange={(e) => setStudentName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Course Name"
        onChange={(e) => setCourse(e.target.value)}
      />

      <input
        type="text"
        placeholder="Wallet Address"
        onChange={(e) => setWalletAddress(e.target.value)}
      />

      <button className="btn" onClick={issueCertificate}>
        Issue Certificate 🚀
      </button>

      <button className="btn" onClick={handleLogout}>
        Logout 🚪
      </button>

      {qrData && (
        <>
          {/* QR Code */}
          <div style={{ marginTop: "20px" }}>
            <h4>Scan QR</h4>
            <QRCodeCanvas value={qrData} />
          </div>

          {/* 🎓 Certificate Design */}
          <div className="certificate" id="certificate">
            

            <h2 style={{ marginTop: "10px" }}>
              Certificate of Completion
            </h2>

            <p>This is to certify that</p>

            <h2 style={{ color: "#4CAF50" }}>{studentName}</h2>

            <p>has successfully completed the course</p>

            <h3>{course}</h3>

            <p style={{ marginTop: "20px" }}>
              Date: {new Date().toLocaleDateString()}
            </p>

            <p>________________________</p>
            <p>Authorized Signature</p>
          </div>

          {/* Download Button */}
          <button className="btn" onClick={downloadPDF}>
            Download Certificate 📄
          </button>
        </>
      )}
    </div>
  );
}

export default IssuerDashboard;