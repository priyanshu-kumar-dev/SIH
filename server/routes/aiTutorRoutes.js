const express = require("express");
const router = express.Router();

const { askTutor } = require("../controllers/tutorController");

router.post("/ask", askTutor);

module.exports = router;