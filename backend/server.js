const express = require("express");
const app = express();

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend running without database 🚀");
});

// Sample API (no DB)
app.post("/issue", (req, res) => {
  const { name, course } = req.body;

  if (!name || !course) {
    return res.status(400).json({ message: "Missing data" });
  }

  // Just return data (no storage)
  res.json({
    message: "Certificate issued (temporary)",
    data: { name, course }
  });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});