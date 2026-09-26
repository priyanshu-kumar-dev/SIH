const askAI = async (question, language = "English") => {
  const q = question.toLowerCase().trim();

  const demoAnswers = {
    "what is javascript":
      "JavaScript is a programming language used to make websites interactive. It can run in the browser as well as on servers using Node.js.",

    "what is react":
      "React is a JavaScript library used to build user interfaces. It allows developers to create reusable components.",

    "what is node js":
      "Node.js is a JavaScript runtime that allows JavaScript to run outside the browser, especially on servers.",

    "what is mern":
      "MERN stands for MongoDB, Express.js, React, and Node.js. These technologies are commonly used together to build full-stack web applications.",

    "what is ai":
      "AI means Artificial Intelligence. It enables computers to perform tasks that normally require human intelligence, such as understanding language, recognizing images, and solving problems.",
  };

  if (demoAnswers[q]) {
    return demoAnswers[q];
  }

  if (language === "Hindi") {
    return `AI Tutor Demo: "${question}" ka simple answer yahan generate hoga. Actual LLM connect karne ke baad AI detailed answer Hindi mein dega.`;
  }

  return `AI Tutor Demo: The answer to "${question}" will be generated here. After connecting an LLM, the tutor will provide a detailed explanation.`;
};


const translateWithAI = async (text, from, to) => {
  const normalizedText = text.trim().toLowerCase();

  const dictionary = {
    "english-hindi": {
      "hello": "नमस्ते",
      "hello.": "नमस्ते।",
      "hi": "नमस्ते",
      "hi.": "नमस्ते।",
      "how are you": "आप कैसे हैं?",
      "how are you?": "आप कैसे हैं?",
      "who are you": "आप कौन हैं?",
      "who are you?": "आप कौन हैं?",
      "where are you going": "आप कहाँ जा रहे हैं?",
      "where are you going?": "आप कहाँ जा रहे हैं?",
      "thank you": "धन्यवाद",
      "good morning": "सुप्रभात",
      "good night": "शुभ रात्रि",
    },

    "hindi-english": {
      "नमस्ते": "Hello.",
      "नमस्ते।": "Hello.",
      "हैलो": "Hello.",
      "हैलो।": "Hello.",
      "आप कैसे हैं": "How are you?",
      "आप कैसे हैं?": "How are you?",
      "आप कैसे हो": "How are you?",
      "आप कैसे हो?": "How are you?",
      "आप कौन हैं": "Who are you?",
      "आप कौन हैं?": "Who are you?",
      "कहाँ जा रहे हो": "Where are you going?",
      "कहाँ जा रहे हो?": "Where are you going?",
      "आप कहाँ जा रहे हो": "Where are you going?",
      "आप कहाँ जा रहे हो?": "Where are you going?",
      "धन्यवाद": "Thank you.",
      "सुप्रभात": "Good morning.",
      "शुभ रात्रि": "Good night.",
    },
  };

  const key = `${from.toLowerCase()}-${to.toLowerCase()}`;

  if (dictionary[key]?.[normalizedText]) {
    return dictionary[key][normalizedText];
  }

  return text;
};


module.exports = {
  askAI,
  translateWithAI,
};