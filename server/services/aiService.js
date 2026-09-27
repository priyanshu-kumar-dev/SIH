const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is missing in .env");
}

const ai = new GoogleGenAI({
  apiKey,
});

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const askTutorAI = async (question, language = "English") => {
  try {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing in .env");
    }

    if (!question || !question.trim()) {
      throw new Error("Question is required");
    }

    const prompt = `
You are BhashaSetu AI Tutor.

Answer the student's question clearly and simply.

Student's preferred language: ${language}

Question:
${question}

Rules:
- Explain in simple language.
- If the student asks a programming question, give a clear explanation and example.
- If the student asks in Hindi, respond in Hindi/Hinglish.
- Keep the answer useful for a student.
- Do not make the answer unnecessarily complicated.
`;

    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(
          `🤖 Gemini request: attempt ${attempt}/${maxRetries}`
        );

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
        });

        if (!response || !response.text) {
          throw new Error("Gemini returned an empty response");
        }

        console.log("✅ Gemini response received");

        return response.text;
      } catch (error) {
        const message = error?.message || "";

        console.error(
          `❌ Gemini attempt ${attempt} failed:`,
          message
        );

        const isTemporaryError =
          message.includes("503") ||
          message.includes("UNAVAILABLE") ||
          message.includes("429") ||
          message.includes("RESOURCE_EXHAUSTED");

        if (!isTemporaryError || attempt === maxRetries) {
          throw error;
        }

        const delay = attempt * 2000;

        console.log(
          `⏳ Retrying Gemini in ${delay / 1000} seconds...`
        );

        await sleep(delay);
      }
    }
  } catch (error) {
    console.error("❌ GEMINI AI ERROR:", error);

    throw new Error(
      error?.message || "Gemini AI request failed"
    );
  }
};

module.exports = {
  askTutorAI,
};