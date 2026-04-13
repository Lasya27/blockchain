const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { ethers } = require("ethers");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });



const app = express();
app.use(cors());
app.use(express.json());
app.post("/upload", upload.single("file"), (req, res) => {
  res.send("File uploaded");
});

/* ================== DATABASE ================== */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("Mongo Error ❌", err));

/* ================== MODEL ================== */

const User = mongoose.model("User", {
  email: String,
  password: String,
  role: String,
  faceDescriptor: Array   // ✅ add this
});

/* ================== REGISTER ================== */

app.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.send("User already exists");

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashed,
      role
    });

    res.send("Registered Successfully");
  } catch (err) {
    res.send("Error");
  }
});

/* ================== LOGIN ================== */

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.send("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.send("Wrong password");

    res.json(user);
  } catch (err) {
    res.send("Error");
  }
});

app.post("/save-face", async (req, res) => {
  const { email, descriptor } = req.body;

  await User.updateOne(
    { email },
    { faceDescriptor: descriptor }
  );

  res.send("Face saved");
});

app.get("/get-face/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  res.json(user.faceDescriptor);
});

/* ================== BLOCKCHAIN SETUP ================== */

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// 🔴 Replace if needed
const wallet = new ethers.Wallet(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  provider
);

// 🔴 Replace if needed
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const abi = [
  "function issueCertificate(address student, string memory name, string memory course)",
  "function getCertificates() view returns (tuple(string studentName, string course, address student)[])"
];

const contract = new ethers.Contract(contractAddress, abi, wallet);

app.get("/certificates/:address", async (req, res) => {
  try {
    const studentAddress = req.params.address;

    const allCertificates = await contract.getCertificates();

    const filtered = allCertificates.filter(
      (cert) =>
        cert.student.toLowerCase() === studentAddress.toLowerCase()
    );

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: "Error fetching certificates" });
  }
});

/* ================== ISSUE CERTIFICATE ================== */

app.post("/issue", async (req, res) => {
  try {
    const { studentName, course, walletAddress } = req.body;

    const tx = await contract.issueCertificate(
      walletAddress,
      studentName,
      course
    );

    await tx.wait();

    res.json({
      message: "Certificate Issued",
      txHash: tx.hash
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Issue failed" });
  }
});

/* ================== VERIFY CERTIFICATE ================== */

app.get("/verify/:txHash", async (req, res) => {
  try {
    const txHash = req.params.txHash;

    const tx = await provider.getTransaction(txHash);

    if (!tx) {
      return res.status(404).json({ message: "Invalid Certificate" });
    }

    res.json({
      message: "Certificate Verified",
      txHash: tx.hash,
      from: tx.from
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Verification failed" });
  }
});

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});



/* ================== START SERVER ================== */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));
