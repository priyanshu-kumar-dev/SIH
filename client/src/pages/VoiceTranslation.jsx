
import React, { useRef, useState } from "react";
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

  const recognitionRef = useRef(null);

  // -----------------------------------------
  // SPEECH RECOGNITION
  // -----------------------------------------
  const startListening = () => {
    setError("");
    setSpeechText("");
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

    // Prevent multiple recognition instances
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.log("Recognition stop:", err);
      }
    }

    const recognition = new SpeechRecognition();

    recognitionRef.current = recognition;

    // Source language controls microphone recognition language
    recognition.lang =
      sourceLanguage === "Hindi"
        ? "hi-IN"
        : "en-IN";

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      const result =
        event.results?.[0]?.[0]?.transcript?.trim();

      if (result) {
        console.log("SPEECH:", result);
        setSpeechText(result);
      }

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
      } else if (event.error === "audio-capture") {
        setError(
          "Microphone was not found. Please check your microphone."
        );
      } else if (event.error === "network") {
        setError(
          "Speech recognition network error. Please check your internet."
        );
      } else {
        setError(
          "Voice recognition failed. Please try again."
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("Recognition start error:", err);
      setIsListening(false);
      setError("Could not start microphone. Please try again.");
    }
  };

  // -----------------------------------------
  // TRANSLATION
  // -----------------------------------------
  const translateVoice = async () => {
    const cleanText = speechText.trim();

    if (!cleanText) {
      setError("Please speak something first.");
      return;
    }

    setError("");
    setIsTranslating(true);

    try {
      // Same language = no API required
      if (sourceLanguage === targetLanguage) {
        setTranslatedText(cleanText);
        setIsTranslating(false);
        return;
      }

      console.log("TRANSLATE REQUEST:", {
        text: cleanText,
        from: sourceLanguage,
        to: targetLanguage,
      });

      const response = await API.post(
        "/translation/translate",
        {
          text: cleanText,
          from: sourceLanguage,
          to: targetLanguage,
        }
      );

      console.log(
        "TRANSLATE RESPONSE:",
        response.data
      );

      const translation =
        response.data?.translation;

      if (translation) {
        setTranslatedText(translation);
        setError("");
      } else {
        setTranslatedText("");
        setError(
          "Translation result not received from server."
        );
      }
    } catch (err) {
      console.error(
        "VOICE TRANSLATION ERROR:",
        err
      );

      console.error(
        "SERVER RESPONSE:",
        err.response?.data
      );

      setTranslatedText("");

      setError(
        err.response?.data?.message ||
          "Translation failed. Please try again."
      );
    } finally {
      setIsTranslating(false);
    }
  };

  // -----------------------------------------
  // TEXT TO SPEECH
  // -----------------------------------------
  const speakTranslation = () => {
    if (!translatedText.trim()) {
      setError("There is no translated text to speak.");
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

    // Target language controls voice output
    speech.lang =
      targetLanguage === "Hindi"
        ? "hi-IN"
        : "en-IN";

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    console.log(
      "TTS LANGUAGE:",
      speech.lang
    );

    window.speechSynthesis.speak(speech);
  };

  // -----------------------------------------
  // SWAP LANGUAGES
  // -----------------------------------------
  const swapLanguages = () => {
    const oldSource = sourceLanguage;
    const oldTarget = targetLanguage;

    const oldSpeech = speechText;
    const oldTranslation = translatedText;

    setSourceLanguage(oldTarget);
    setTargetLanguage(oldSource);

    // Swap displayed text also
    setSpeechText(oldTranslation);
    setTranslatedText(oldSpeech);

    setError("");

    // Stop current speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // Stop microphone
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.log("Recognition stop:", err);
      }

      recognitionRef.current = null;
    }

    setIsListening(false);
  };

  // -----------------------------------------
  // SOURCE LANGUAGE CHANGE
  // -----------------------------------------
  const handleSourceChange = (e) => {
    const newLanguage = e.target.value;

    setSourceLanguage(newLanguage);
    setSpeechText("");
    setTranslatedText("");
    setError("");

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.log("Recognition stop:", err);
      }

      recognitionRef.current = null;
    }

    setIsListening(false);
  };

  // -----------------------------------------
  // TARGET LANGUAGE CHANGE
  // -----------------------------------------
  const handleTargetChange = (e) => {
    const newLanguage = e.target.value;

    setTargetLanguage(newLanguage);
    setTranslatedText("");
    setError("");

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="voice-page">

      {/* HEADER */}
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

      {/* MAIN CARD */}
      <div className="voice-card">

        {/* LANGUAGE SELECTOR */}
        <div className="voice-language-row">

          {/* FROM */}
          <div className="voice-language">

            <label>
              From
            </label>

            <select
              value={sourceLanguage}
              onChange={handleSourceChange}
            >
              <option value="Hindi">
                Hindi
              </option>

              <option value="English">
                English
              </option>
            </select>

          </div>

          {/* SWAP */}
          <button
            className="voice-swap"
            onClick={swapLanguages}
            type="button"
            aria-label="Swap languages"
          >
            ⇄
          </button>

          {/* TO */}
          <div className="voice-language">

            <label>
              To
            </label>

            <select
              value={targetLanguage}
              onChange={handleTargetChange}
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

        {/* MICROPHONE */}
        <div className="voice-main">

          <div
            className={`microphone ${
              isListening ? "listening" : ""
            }`}
            onClick={startListening}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" ||
                e.key === " "
              ) {
                startListening();
              }
            }}
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
            Speak in {sourceLanguage}
          </p>

        </div>

        {/* ERROR */}
        {error && (
          <div className="voice-error">
            {error}
          </div>
        )}

        {/* RESULTS */}
        <div className="voice-results">

          {/* SPEECH */}
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

          {/* TRANSLATION */}
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

        {/* ACTION BUTTONS */}
        <div className="voice-actions">

          <button
            className="translate-voice-btn"
            onClick={translateVoice}
            disabled={
              !speechText.trim() ||
              isTranslating
            }
            type="button"
          >
            {isTranslating
              ? "Translating..."
              : "Translate Voice →"}
          </button>

          <button
            className="speak-btn"
            onClick={speakTranslation}
            disabled={!translatedText.trim()}
            type="button"
          >
            🔊 Listen
          </button>

        </div>

      </div>

      {/* INFO */}
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
