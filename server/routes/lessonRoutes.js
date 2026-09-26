const express = require("express");

const router = express.Router();

const {
  getLessons,
  getLessonById,
  createLesson,
} = require("../controllers/lessonController");

router.get("/", getLessons);

router.get("/:id", getLessonById);

router.post("/", createLesson);

module.exports = router;