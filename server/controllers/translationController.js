
const { translateWithAI } = require("../services/translationService");

const translateText = async (req, res) => {
  console.log("TRANSLATE API CALLED");
  console.log("BODY:", req.body);

  try {
    const { text, from, to } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "From and To languages are required",
      });
    }

    const translation = await translateWithAI(
      text.trim(),
      from,
      to
    );

    console.log("TRANSLATION:", translation);

    return res.status(200).json({
      success: true,
      translation,
    });
  } catch (error) {
    console.error("TRANSLATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Translation failed",
      error: error.message,
    });
  }
};

module.exports = {
  translateText,
};

