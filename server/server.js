const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./db/db");
const translationRoutes = require("./routes/translationRoutes");
const authRouter = require("./routes/auth.route");

connectDB();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    message: "BhashaSetu API is running 🚀",
  });
});

app.use("/api/auth/user", authRouter);
app.use("/api/translation", translationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});