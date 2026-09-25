const express = require("express");
const cors = require("cors");
require("dotenv").config();

const translationRoutes = require("./routes/translationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "BhashaSetu API is running 🚀",
  });
});

app.use("/api/translation", translationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});