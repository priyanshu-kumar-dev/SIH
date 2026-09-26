
const express = require("express");

const router = express.Router();

const { translateText } = require("../controllers/translationController");

router.post("/translate", translateText);

module.exports = router;

