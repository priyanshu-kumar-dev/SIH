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

/*
  Authentication

  Final routes depend on auth.route.js:

  If auth.route.js contains:
  router.post("/signup", ...)
  router.post("/login", ...)

  then:
  POST /api/auth/user/signup
  POST /api/auth/user/login
*/

app.use("/api/auth/user", authRouter);

/* =========================
   OTHER API ROUTES
========================= */

app.use("/api/translation", translationRoutes);

app.use("/api/ai", aiRoutes);

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
  console.error("SERVER ERROR:", err);

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

setupSignaling(server);

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log("=================================");
  console.log("🚀 BhashaSetu Server Started");
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("");
  console.log("🔐 Auth:");
  console.log("   POST /api/auth/user/signup");
  console.log("   POST /api/auth/user/login");
  console.log("");
  console.log("📚 Lessons API: /api/lessons");
  console.log("🤖 AI Tutor API: /api/ai");
  console.log("🌐 Translation API: /api/translation");
  console.log("📞 WebRTC Signaling: Socket.IO");
  console.log("=================================");
});