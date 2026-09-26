const { askTutorAI } = require("../services/tutorService");

const askTutor = async (req, res) => {
  console.log("AI TUTOR API CALLED");
  console.log("BODY:", req.body);

  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const answer = await askTutorAI(question.trim());

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("AI TUTOR ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "AI Tutor failed",
      error: error.message,
    });
  }
};

module.exports = {
  askTutor,
};