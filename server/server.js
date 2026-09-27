const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./db/db");
const translationRoutes = require("./routes/translationRoutes");
const aiRoutes = require("./routes/aiRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const authRouter = require("./routes/auth.route");

const setupSignaling = require("./socket/signaling");

const app = express();

/* =========================
   DATABASE
========================= */

connectDB();

/* =========================
   MIDDLEWARE
========================= */

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

/* Authentication */
app.use("/api/auth/user", authRouter);

/* Translation */
app.use("/api/translation", translationRoutes);

/* AI Tutor */
app.use("/api/ai", aiRoutes);

/* Lessons */
app.use("/api/lessons", lessonRoutes);

/* =========================
   404 HANDLER
========================= */

app.use((req, res) => {
  console.log("❌ API route not found:", req.method, req.originalUrl);

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
  console.error("❌ SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

/* =========================
   HTTP SERVER
========================= */

const server = http.createServer(app);

/* =========================
   WEBRTC / SOCKET.IO
========================= */

try {
  setupSignaling(server);
  console.log("✅ Socket.IO / WebRTC signaling initialized");
} catch (error) {
  console.error("❌ Socket.IO initialization failed:");
  console.error(error);
}

/* =========================
   ENVIRONMENT CHECK
========================= */

console.log("=================================");
console.log("🔧 Environment Check");
console.log(
  "🤖 GEMINI API KEY:",
  process.env.GEMINI_API_KEY ? "Loaded" : "Missing"
);
console.log(
  "🔑 OPENAI API KEY:",
  process.env.OPENAI_API_KEY ? "Loaded" : "Missing"
);
console.log("=================================");

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 5000;

server.on("error", (error) => {
  console.error("❌ SERVER START ERROR:");

  if (error.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.error(
      `👉 Another server may already be running on http://localhost:${PORT}`
    );
  } else {
    console.error(error);
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("=================================");
  console.log("🚀 BhashaSetu Server Started");
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("");

  console.log("🔐 Auth:");
  console.log("   POST /api/auth/user/signup");
  console.log("   POST /api/auth/user/login");
  console.log("");

  console.log("📚 Lessons API:");
  console.log("   /api/lessons");
  console.log("");

  console.log("🤖 AI Tutor API:");
  console.log("   POST /api/ai/ask");
  console.log("");

  console.log("🌐 Translation API:");
  console.log("   /api/translation");
  console.log("");

  console.log("📞 WebRTC Signaling:");
  console.log("   Socket.IO");
  console.log("=================================");
});