const { translateWithAI } = require("../services/llmService");

const translateText = async (req, res) => {
  try {
    const { text, from, to } = req.body;

    if (!text || !from || !to) {
      return res.status(400).json({
        success: false,
        message: "Text, source language and target language are required",
      });
    }

    const translation = await translateWithAI(text, from, to);

    res.status(200).json({
      success: true,
      translation,
    });
  } catch (error) {
    console.error("========== AI TRANSLATION ERROR ==========");
    console.error("Message:", error.message);
    console.error("Status:", error.response?.status);
    console.error(
      "OpenAI Error:",
      JSON.stringify(error.response?.data, null, 2)
    );
    console.error("==========================================");

    const apiMessage =
      error.response?.data?.error?.message || error.message;

    res.status(500).json({
      success: false,
      message: apiMessage,
    });
  }
};

module.exports = {
  translateText,
};