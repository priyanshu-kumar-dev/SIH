const express = require("express");
const cors = require("cors");
require("dotenv").config();

const translationRoutes = require("./routes/translationRoutes");
const aiRoutes = require("./routes/aiRoutes");
const lessonRoutes = require("./routes/lessonRoutes");

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* =========================
   TEST ROUTE
========================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BhashaSetu API is running 🚀",
  });
});

/* =========================
   API ROUTES
========================= */

// Translation API
app.use("/api/translation", translationRoutes);

// AI Tutor API
app.use("/api/ai", aiRoutes);

// Vernacular Learning API
app.use("/api/lessons", lessonRoutes);

/* =========================
   404 HANDLER
========================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("=================================");
  console.log("🚀 BhashaSetu Server Started");
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("📚 Lessons API: /api/lessons");
  console.log("🤖 AI Tutor API: /api/ai");
  console.log("🌐 Translation API: /api/translation");
  console.log("=================================");
});