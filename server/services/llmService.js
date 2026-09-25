const translations = {
hindiToEnglish: {
"नमस्ते": "Hello",
"हैलो": "Hello",
"हैलो।": "Hello.",
"आप कैसे हैं?": "How are you?",
"आप कहाँ जा रहे हैं?": "Where are you going?",
"हैलो आप कहाँ जा रहे हैं?":
"Hello, where are you going?",
"हैलो आप कहाँ जा रहे हैं।":
"Hello, where are you going?",
"आपका नाम क्या है?":
"What is your name?",
"मेरा नाम प्रियांशु है":
"My name is Priyanshu.",
"मेरा नाम प्रियंशु है":
"My name is Priyanshu.",
"मैं ठीक हूँ":
"I am fine.",
"धन्यवाद":
"Thank you.",
"शुभ प्रभात":
"Good morning.",
"शुभ रात्रि":
"Good night.",
"मुझे अंग्रेजी सीखनी है":
"I want to learn English.",
"मुझे हिंदी आती है":
"I know Hindi.",
"आप कहाँ रहते हैं?":
"Where do you live?",
"आप क्या कर रहे हैं?":
"What are you doing?",
"मुझे आपकी मदद चाहिए":
"I need your help.",
"यह बहुत अच्छा है":
"This is very good.",
"आज मौसम अच्छा है":
"The weather is good today.",
},

englishToHindi: {
"hello": "नमस्ते",
"hello.": "नमस्ते।",
"hi": "नमस्ते",
"how are you?": "आप कैसे हैं?",
"where are you going?":
"आप कहाँ जा रहे हैं?",
"hello, where are you going?":
"हैलो, आप कहाँ जा रहे हैं?",
"what is your name?":
"आपका नाम क्या है?",
"my name is priyanshu.":
"मेरा नाम प्रियांशु है।",
"my name is priyanshu":
"मेरा नाम प्रियांशु है।",
"i am fine.":
"मैं ठीक हूँ।",
"i am fine":
"मैं ठीक हूँ।",
"thank you":
"धन्यवाद",
"thank you.":
"धन्यवाद।",
"good morning":
"शुभ प्रभात",
"good morning.":
"शुभ प्रभात।",
"good night":
"शुभ रात्रि",
"good night.":
"शुभ रात्रि।",
"i want to learn english":
"मुझे अंग्रेजी सीखनी है।",
"i want to learn english.":
"मुझे अंग्रेजी सीखनी है।",
"i know hindi":
"मुझे हिंदी आती है।",
"i know hindi.":
"मुझे हिंदी आती है।",
"where do you live?":
"आप कहाँ रहते हैं?",
"what are you doing?":
"आप क्या कर रहे हैं?",
"i need your help.":
"मुझे आपकी मदद चाहिए।",
"this is very good.":
"यह बहुत अच्छा है।",
},
};

const translateWithAI = async (
text,
from,
to
) => {
const cleanText = text.trim();

if (
from === "Hindi" &&
to === "English"
) {
const result =
translations.hindiToEnglish[
cleanText
];


if (result) {
  return result;
}

return `English translation: ${cleanText}`;


}

if (
from === "English" &&
to === "Hindi"
) {
const result =
translations.englishToHindi[
cleanText.toLowerCase()
];


if (result) {
  return result;
}

return `हिंदी अनुवाद: ${cleanText}`;


}

if (from === to) {
return cleanText;
}

return cleanText;
};

module.exports = {
translateWithAI,
};
