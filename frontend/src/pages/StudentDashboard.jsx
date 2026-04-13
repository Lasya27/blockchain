import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import * as faceapi from "face-api.js";

function StudentDashboard() {
  const [walletAddress, setWalletAddress] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [faceVerified, setFaceVerified] = useState(false);

  const videoRef = useRef();

  const email = localStorage.getItem("userEmail") || "student@gmail.com";

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    };
    loadModels();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // Start camera
  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
      });
  };

  // Save face to DB
  const saveFace = async () => {
    const detection = await faceapi.detectSingleFace(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      alert("Face not detected");
      return;
    }

    const descriptor = Array.from(detection.descriptor);

    await axios.post("http://localhost:5000/save-face", {
      email,
      descriptor
    });

    alert("Face saved in DB ✅");
  };

  // Match face
  const verifyFace = async () => {
    const res = await axios.get(
      `http://localhost:5000/get-face/${email}`
    );

    const stored = new Float32Array(res.data);

    const live = await faceapi.detectSingleFace(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!live) {
      alert("Face not detected");
      return;
    }

    const distance = faceapi.euclideanDistance(
      stored,
      live.descriptor
    );

    if (distance < 0.6) {
      setFaceVerified(true);
      alert("Face Matched ✅");
    } else {
      alert("Face Not Matched ❌");
    }
  };

  // Fetch certificates
  const fetchCertificates = async () => {
    if (!faceVerified) {
      alert("Verify face first!");
      return;
    }

    const res = await axios.get(
      `http://localhost:5000/certificates/${walletAddress}`
    );

    setCertificates(res.data);
  };

  // Upload file
  const uploadFile = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    await axios.post("http://localhost:5000/upload", formData);
    alert("Uploaded to backend ✅");
  };

  return (
    <div className="card">
      <h2>🎓 Student Dashboard</h2>

      <button className="btn" onClick={startVideo}>
        Start Camera 📷
      </button>

      <video ref={videoRef} autoPlay width="250" />

      <button className="btn" onClick={saveFace}>
        Save Face 🧠
      </button>

      <button className="btn" onClick={verifyFace}>
        Face Login 🔐
      </button>

      <input
        type="text"
        placeholder="Enter Wallet Address"
        onChange={(e) => setWalletAddress(e.target.value)}
      />

      <button className="btn" onClick={fetchCertificates}>
        View Certificates
      </button>

      <button className="btn" onClick={handleLogout}>
        Logout 🚪
      </button>

      <input type="file" onChange={uploadFile} />

      {certificates.map((cert, index) => (
        <div key={index} className="certificate">
          <p>Name: {cert.studentName}</p>
          <p>Course: {cert.course}</p>
        </div>
      ))}
    </div>
  );
}

export default StudentDashboard;