
const translations = {
  hindiToEnglish: {
    "नमस्ते": "Hello",
    "नमस्ते।": "Hello.",
    "हैलो": "Hello",
    "हैलो।": "Hello.",

    "आप": "you",
    "तुम": "you",
    "मैं": "I",
    "हम": "we",
    "वह": "he/she",
    "यह": "this",
    "कैसे": "how",
    "कैसा": "how",
    "कौन": "who",
    "क्या": "what",
    "कहाँ": "where",
    "कब": "when",
    "क्यों": "why",

    "हैं": "are",
    "हूँ": "am",
    "हो": "are",
    "है": "is",

    "जा": "go",
    "जाते": "go",
    "जाता": "go",
    "जाती": "go",
    "जा रहे": "going",
    "जा रही": "going",
    "रहे": "are",
    "रही": "are",

    "अच्छा": "good",
    "अच्छी": "good",
    "बहुत": "very",
    "ठीक": "fine",
    "धन्यवाद": "thank you",
    "हाँ": "yes",
    "हां": "yes",
    "नहीं": "no",
    "कृपया": "please",
    "माफ": "sorry",

    "नाम": "name",
    "मेरा": "my",
    "आपका": "your",
    "तुम्हारा": "your",

    "पानी": "water",
    "खाना": "food",
    "घर": "home",
    "स्कूल": "school",
    "कॉलेज": "college",
    "किताब": "book",
    "दोस्त": "friend",

    "आप कैसे हैं?": "How are you?",
    "आप कैसे हो?": "How are you?",
    "तुम कैसे हो?": "How are you?",
    "आप कहाँ जा रहे हैं?": "Where are you going?",
    "आप कहाँ जा रहे हो?": "Where are you going?",
    "तुम कहाँ जा रहे हो?": "Where are you going?",
    "कहाँ जा रहे हो?": "Where are you going?",
    "आप कौन हैं?": "Who are you?",
    "आप कौन है?": "Who are you?",
    "तुम कौन हो?": "Who are you?",
    "आपका नाम क्या है?": "What is your name?",
    "तुम्हारा नाम क्या है?": "What is your name?",
    "मैं ठीक हूँ": "I am fine.",
    "मैं ठीक हूं": "I am fine.",
    "मेरा नाम प्रियांशु है": "My name is Priyanshu.",
    "मुझे अंग्रेजी सीखनी है": "I want to learn English.",
    "मुझे हिंदी आती है": "I know Hindi.",
    "मुझे आपकी मदद चाहिए": "I need your help.",
  },

  englishToHindi: {
    "hello": "नमस्ते",
    "hello.": "नमस्ते।",
    "hi": "नमस्ते",
    "hi.": "नमस्ते।",

    "you": "आप",
    "i": "मैं",
    "we": "हम",
    "he": "वह",
    "she": "वह",
    "this": "यह",
    "how": "कैसे",
    "who": "कौन",
    "what": "क्या",
    "where": "कहाँ",
    "when": "कब",
    "why": "क्यों",

    "are": "हैं",
    "am": "हूँ",
    "is": "है",

    "go": "जाना",
    "going": "जा रहे",
    "good": "अच्छा",
    "very": "बहुत",
    "fine": "ठीक",
    "thank": "धन्यवाद",
    "thanks": "धन्यवाद",
    "yes": "हाँ",
    "no": "नहीं",
    "please": "कृपया",
    "sorry": "माफ कीजिए",

    "name": "नाम",
    "my": "मेरा",
    "your": "आपका",

    "water": "पानी",
    "food": "खाना",
    "home": "घर",
    "school": "स्कूल",
    "college": "कॉलेज",
    "book": "किताब",
    "friend": "दोस्त",

    "how are you?": "आप कैसे हैं?",
    "how are you": "आप कैसे हैं?",
    "where are you going?": "आप कहाँ जा रहे हैं?",
    "where are you going": "आप कहाँ जा रहे हैं?",
    "who are you?": "आप कौन हैं?",
    "who are you": "आप कौन हैं?",
    "what is your name?": "आपका नाम क्या है?",
    "what is your name": "आपका नाम क्या है?",
    "my name is priyanshu.": "मेरा नाम प्रियांशु है।",
    "my name is priyanshu": "मेरा नाम प्रियांशु है।",
    "i am fine.": "मैं ठीक हूँ।",
    "i am fine": "मैं ठीक हूँ।",
  },
};

const normalizeHindi = (text) => {
  return text
    .trim()
    .replace(/\s+/g, " ");
};

const normalizeEnglish = (text) => {
  return text
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
};

const translateWithAI = async (text, from, to) => {
  const cleanText = text.trim();

  if (!cleanText) {
    return "";
  }

  if (from === to) {
    return cleanText;
  }

  // Hindi -> English
  if (from === "Hindi" && to === "English") {
    const normalized = normalizeHindi(cleanText);

    // Exact sentence
    if (translations.hindiToEnglish[normalized]) {
      return translations.hindiToEnglish[normalized];
    }

    // Remove final punctuation and try again
    const withoutPunctuation = normalized.replace(/[।!?]+$/, "");

    if (translations.hindiToEnglish[withoutPunctuation]) {
      return translations.hindiToEnglish[withoutPunctuation];
    }

    // Special sentence patterns
    if (
      normalized.includes("कैसे") &&
      (normalized.includes("हो") || normalized.includes("हैं"))
    ) {
      return "How are you?";
    }

    if (
      normalized.includes("कहाँ") &&
      normalized.includes("जा")
    ) {
      return "Where are you going?";
    }

    if (
      normalized.includes("कौन")
    ) {
      return "Who are you?";
    }

    if (
      normalized.includes("नाम") &&
      normalized.includes("क्या")
    ) {
      return "What is your name?";
    }

    return cleanText;
  }

  // English -> Hindi
  if (from === "English" && to === "Hindi") {
    const normalized = normalizeEnglish(cleanText);

    // Exact sentence
    if (translations.englishToHindi[normalized]) {
      return translations.englishToHindi[normalized];
    }

    // Remove punctuation and try again
    const withoutPunctuation = normalized.replace(/[.!?]+$/, "");

    if (translations.englishToHindi[withoutPunctuation]) {
      return translations.englishToHindi[withoutPunctuation];
    }

    // Special sentence patterns
    if (normalized.includes("how are you")) {
      return "आप कैसे हैं?";
    }

    if (normalized.includes("where are you going")) {
      return "आप कहाँ जा रहे हैं?";
    }

    if (normalized.includes("who are you")) {
      return "आप कौन हैं?";
    }

    if (normalized.includes("what is your name")) {
      return "आपका नाम क्या है?";
    }

    return cleanText;
  }

  return cleanText;
};

module.exports = {
  translateWithAI,
};

