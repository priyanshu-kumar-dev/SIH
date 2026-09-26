
const translations = {
  hindiToEnglish: {
    "नमस्ते": "Hello",
    "हैलो": "Hello",
    "हैलो।": "Hello.",
    "आप कैसे हैं?": "How are you?",
    "आप कहाँ जा रहे हैं?": "Where are you going?",
    "हैलो आप कहाँ जा रहे हैं?": "Hello, where are you going?",
    "हैलो आप कहाँ जा रहे हैं।": "Hello, where are you going?",
    "आप कौन हैं?": "Who are you?",
    "तुम कौन हो?": "Who are you?",
    "आप कौन है?": "Who are you?",
    "आपका नाम क्या है?": "What is your name?",
    "मेरा नाम प्रियांशु है": "My name is Priyanshu.",
    "मेरा नाम प्रियंशु है": "My name is Priyanshu.",
    "मैं ठीक हूँ": "I am fine.",
    "धन्यवाद": "Thank you.",
    "शुभ प्रभात": "Good morning.",
    "शुभ रात्रि": "Good night.",
    "मुझे अंग्रेजी सीखनी है": "I want to learn English.",
    "मुझे हिंदी आती है": "I know Hindi.",
    "आप कहाँ रहते हैं?": "Where do you live?",
    "आप क्या कर रहे हैं?": "What are you doing?",
    "मुझे आपकी मदद चाहिए": "I need your help.",
    "यह बहुत अच्छा है": "This is very good.",
    "आज मौसम अच्छा है": "The weather is good today.",
  },

  englishToHindi: {
    "hello": "नमस्ते",
    "hello.": "नमस्ते।",
    "hi": "नमस्ते",
    "how are you?": "आप कैसे हैं?",
    "where are you going?": "आप कहाँ जा रहे हैं?",
    "hello, where are you going?": "हैलो, आप कहाँ जा रहे हैं?",
    "who are you?": "आप कौन हैं?",
    "hello, who are you?": "हैलो, आप कौन हैं?",
    "what is your name?": "आपका नाम क्या है?",
    "my name is priyanshu": "मेरा नाम प्रियांशु है।",
    "my name is priyanshu.": "मेरा नाम प्रियांशु है।",
    "i am fine": "मैं ठीक हूँ।",
    "i am fine.": "मैं ठीक हूँ।",
    "thank you": "धन्यवाद",
    "thank you.": "धन्यवाद।",
    "good morning": "शुभ प्रभात",
    "good morning.": "शुभ प्रभात।",
    "good night": "शुभ रात्रि",
    "good night.": "शुभ रात्रि।",
    "i want to learn english": "मुझे अंग्रेजी सीखनी है।",
    "i want to learn english.": "मुझे अंग्रेजी सीखनी है।",
    "i know hindi": "मुझे हिंदी आती है।",
    "i know hindi.": "मुझे हिंदी आती है।",
    "where do you live?": "आप कहाँ रहते हैं?",
    "what are you doing?": "आप क्या कर रहे हैं?",
    "i need your help": "मुझे आपकी मदद चाहिए।",
    "i need your help.": "मुझे आपकी मदद चाहिए।",
    "this is very good": "यह बहुत अच्छा है।",
    "this is very good.": "यह बहुत अच्छा है।",
  },
};

const normalizeHindi = (text) => {
  return text.trim().replace(/\s+/g, " ");
};

const normalizeEnglish = (text) => {
  return text.trim().replace(/\s+/g, " ").toLowerCase();
};

const translateWithAI = async (text, from, to) => {
  const cleanText = text.trim();

  if (!cleanText) {
    return "";
  }

  // Same language
  if (from === to) {
    return cleanText;
  }

  // Hindi -> English
  if (from === "Hindi" && to === "English") {
    const key = normalizeHindi(cleanText);

    const result = translations.hindiToEnglish[key];

    if (result) {
      return result;
    }

    return cleanText;
  }

  // English -> Hindi
  if (from === "English" && to === "Hindi") {
    const key = normalizeEnglish(cleanText);

    const result = translations.englishToHindi[key];

    if (result) {
      return result;
    }

    return cleanText;
  }

  return cleanText;
};

module.exports = {
  translateWithAI,
};

