const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./db/db");
const translationRoutes = require("./routes/translationRoutes");
<<<<<<< HEAD
const aiRoutes = require("./routes/aiRoutes");
const lessonRoutes = require("./routes/lessonRoutes");

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
=======
const authRouter = require("./routes/auth.route");

connectDB();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
>>>>>>> 818830660ec9b58b2c38c5f393b7e7ba36c57ee9

app.use(express.json());
app.use(cookieParser());

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

<<<<<<< HEAD
/* =========================
   API ROUTES
========================= */

// Translation API
=======
app.use("/api/auth/user", authRouter);
>>>>>>> 818830660ec9b58b2c38c5f393b7e7ba36c57ee9
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

<<<<<<< HEAD
app.listen(PORT, () => {
  console.log("=================================");
  console.log("🚀 BhashaSetu Server Started");
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("📚 Lessons API: /api/lessons");
  console.log("🤖 AI Tutor API: /api/ai");
  console.log("🌐 Translation API: /api/translation");
  console.log("=================================");
=======
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
>>>>>>> 818830660ec9b58b2c38c5f393b7e7ba36c57ee9
});