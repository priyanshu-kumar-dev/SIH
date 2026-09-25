import React, { useState } from "react";
import API from "../services/api";
import "./VoiceTranslation.css";

const VoiceTranslation = () => {
  const [sourceLanguage, setSourceLanguage] = useState("Hindi");
  const [targetLanguage, setTargetLanguage] = useState("English");

  const [isListening, setIsListening] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [error, setError] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const startListening = () => {
    setError("");
    setTranslatedText("");

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Speech recognition is not supported. Please use Google Chrome."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    // IMPORTANT:
    // Speech recognition language depends on SOURCE language.
    recognition.lang =
      sourceLanguage === "Hindi" ? "hi-IN" : "en-IN";

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechText("");
    };

    recognition.onresult = (event) => {
      const result =
        event.results[0][0].transcript;

      setSpeechText(result);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setIsListening(false);

      if (event.error === "not-allowed") {
        setError(
          "Microphone permission denied. Please allow microphone access."
        );
      } else if (event.error === "no-speech") {
        setError(
          "No speech detected. Please speak again."
        );
      } else {
        setError(
          "Voice recognition failed. Please try again."
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const translateVoice = async () => {
    if (!speechText.trim()) {
      setError("Please speak something first.");
      return;
    }

    setError("");
    setIsTranslating(true);

    try {
      const response = await API.post(
        "/translation/translate",
        {
          text: speechText,
          from: sourceLanguage,
          to: targetLanguage,
        }
      );

      if (response.data?.translation) {
        setTranslatedText(
          response.data.translation
        );
      } else {
        setError("Translation result not received.");
      }
    } catch (error) {
      console.error(
        "Voice translation error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Translation failed. Please try again."
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const speakTranslation = () => {
    if (!translatedText.trim()) {
      return;
    }

    if (!window.speechSynthesis) {
      setError(
        "Text-to-speech is not supported in this browser."
      );
      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(
        translatedText
      );

    // IMPORTANT:
    // Speech output depends on TARGET language.
    if (targetLanguage === "Hindi") {
      speech.lang = "hi-IN";
    } else {
      speech.lang = "en-IN";
    }

    speech.rate = 0.9;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  const swapLanguages = () => {
    const oldSource = sourceLanguage;
    const oldTarget = targetLanguage;

    setSourceLanguage(oldTarget);
    setTargetLanguage(oldSource);

    setSpeechText(translatedText);
    setTranslatedText(speechText);

    setError("");
  };

  return (
    <div className="voice-page">

      <div className="voice-header">
        <span className="voice-badge">
          🎙️ Voice AI
        </span>

        <h1>
          Speak. Translate. Learn.
        </h1>

        <p>
          Use your voice to translate Hindi and
          English with AI-powered language
          technology.
        </p>
      </div>

      <div className="voice-card">

        <div className="voice-language-row">

          <div className="voice-language">
            <label>From</label>

            <select
              value={sourceLanguage}
              onChange={(e) => {
                setSourceLanguage(e.target.value);
                setTranslatedText("");
                setSpeechText("");
              }}
            >
              <option value="Hindi">
                Hindi
              </option>

              <option value="English">
                English
              </option>
            </select>
          </div>

          <button
            className="voice-swap"
            onClick={swapLanguages}
          >
            ⇄
          </button>

          <div className="voice-language">
            <label>To</label>

            <select
              value={targetLanguage}
              onChange={(e) => {
                setTargetLanguage(e.target.value);
                setTranslatedText("");
              }}
            >
              <option value="English">
                English
              </option>

              <option value="Hindi">
                Hindi
              </option>
            </select>
          </div>

        </div>

        <div className="voice-main">

          <div
            className={`microphone ${
              isListening ? "listening" : ""
            }`}
            onClick={startListening}
          >
            <div className="mic-circle">
              🎤
            </div>
          </div>

          <h2>
            {isListening
              ? "Listening..."
              : "Tap to Speak"}
          </h2>

          <p>
            {isListening
              ? `Speak in ${sourceLanguage}`
              : `Speak in ${sourceLanguage}`}
          </p>

        </div>

        {error && (
          <div className="voice-error">
            {error}
          </div>
        )}

        <div className="voice-results">

          <div className="voice-result-box">

            <div className="result-heading">

              <span>
                🗣️ Your Speech
              </span>

              <span className="language-tag">
                {sourceLanguage}
              </span>

            </div>

            <div className="voice-text">

              {speechText ||
                `Speak in ${sourceLanguage}...`}

            </div>

          </div>

          <div className="voice-result-box">

            <div className="result-heading">

              <span>
                🌐 Translation
              </span>

              <span className="language-tag">
                {targetLanguage}
              </span>

            </div>

            <div className="voice-text translated">

              {translatedText ||
                `Translation in ${targetLanguage} will appear here...`}

            </div>

          </div>

        </div>

        <div className="voice-actions">

          <button
            className="translate-voice-btn"
            onClick={translateVoice}
            disabled={
              !speechText || isTranslating
            }
          >
            {isTranslating
              ? "Translating..."
              : "Translate Voice →"}
          </button>

          <button
            className="speak-btn"
            onClick={speakTranslation}
            disabled={!translatedText}
          >
            🔊 Listen
          </button>

        </div>

      </div>

      <div className="voice-info">

        <div className="info-item">

          <span>🎤</span>

          <div>
            <strong>
              Speech Recognition
            </strong>

            <p>
              Convert your voice into text.
            </p>
          </div>

        </div>

        <div className="info-item">

          <span>🤖</span>

          <div>
            <strong>
              AI Translation
            </strong>

            <p>
              Hindi ↔ English translation.
            </p>
          </div>

        </div>

        <div className="info-item">

          <span>🔊</span>

          <div>
            <strong>
              Text to Speech
            </strong>

            <p>
              Listen to translated speech.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default VoiceTranslation;