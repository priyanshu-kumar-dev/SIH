const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const askTutorAI = async (question, language = "English") => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing in .env");
  }

  if (!question || !question.trim()) {
    throw new Error("Question is required");
  }

  const response = await client.responses.create({
    model: "gpt-5.6-luna",
    input: [
      {
        role: "system",
        content: `You are BhashaSetu AI Tutor.

Explain educational concepts in simple language.

Student language: ${language}

If Hindi:
- Answer mainly in simple Hindi.
- Keep technical terms in English when useful.
- Give simple examples.

If English:
- Answer in simple English.
- Avoid difficult words.

Be clear, helpful and concise.`,
      },
      {
        role: "user",
        content: question.trim(),
      },
    ],
  });

  return response.output_text.trim();
};

module.exports = {
  askTutorAI,
};