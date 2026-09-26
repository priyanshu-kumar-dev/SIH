const Lesson = require("../models/Lesson");

const getLessons = async (req, res) => {
  try {
    const { language, subject } = req.query;

    const filter = {};

    if (language) {
      filter.language = language;
    }

    if (subject) {
      filter.subject = subject;
    }

    const lessons = await Lesson.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: lessons.length,
      lessons,
    });
  } catch (error) {
    console.error("GET LESSONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch lessons",
      error: error.message,
    });
  }
};

const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    return res.status(200).json({
      success: true,
      lesson,
    });
  } catch (error) {
    console.error("GET LESSON ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch lesson",
      error: error.message,
    });
  }
};

const createLesson = async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      lesson,
    });
  } catch (error) {
    console.error("CREATE LESSON ERROR:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to create lesson",
      error: error.message,
    });
  }
};

module.exports = {
  getLessons,
  getLessonById,
  createLesson,
};