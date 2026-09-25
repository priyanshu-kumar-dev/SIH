import React, { useState } from "react";
import "./Translation.css";
import API from "../services/api";

const Translation = () => {
  const [sourceLanguage, setSourceLanguage] = useState("Hindi");
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const translateText = async () => {
    if (!text.trim()) {
      setError("Please enter some text.");
      return;
    }

    if (sourceLanguage === targetLanguage) {
      setTranslatedText(text);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setTranslatedText("");

      const response = await API.post("/translation/translate", {
        text: text.trim(),
        from: sourceLanguage,
        to: targetLanguage,
      });

      if (response.data.success) {
        setTranslatedText(response.data.translation);
      } else {
        setError("Translation failed.");
      }
    } catch (err) {
      console.error("Translation error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to connect to translation service."
      );
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);

    setText(translatedText);
    setTranslatedText(text);

    setError("");
  };

  const clearText = () => {
    setText("");
    setTranslatedText("");
    setError("");
  };

  return (
    <div className="translation-page">
      <div className="translation-header">
        <span className="badge">AI Translation</span>

        <h1>Break Language Barriers</h1>

        <p>
          Translate text between Hindi and English using
          AI-powered language technology.
        </p>
      </div>

      <div className="translator-card">
        {/* Language Selection */}

        <div className="language-row">
          <div>
            <label>From</label>

            <select
              value={sourceLanguage}
              onChange={(e) => {
                setSourceLanguage(e.target.value);
                setTranslatedText("");
              }}
            >
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
            </select>
          </div>

          <button
            className="swap-btn"
            onClick={swapLanguages}
            title="Swap languages"
          >
            ⇄
          </button>

          <div>
            <label>To</label>

            <select
              value={targetLanguage}
              onChange={(e) => {
                setTargetLanguage(e.target.value);
                setTranslatedText("");
              }}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>
        </div>

        {/* Translation Boxes */}

        <div className="translation-boxes">
          {/* Input */}

          <div className="text-box">
            <textarea
              placeholder={
                sourceLanguage === "Hindi"
                  ? "यहाँ हिंदी में लिखें..."
                  : "Type something in English..."
              }
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setError("");
              }}
            />

            <div className="text-box-footer">
              <span>{text.length} characters</span>

              {text && (
                <button
                  className="clear-btn"
                  onClick={clearText}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Output */}

          <div className="text-box result-box">
            {loading ? (
              <div className="translation-loading">
                <div className="spinner"></div>
                <span>AI is translating...</span>
              </div>
            ) : (
              <div>
                {translatedText ||
                  "Translation will appear here..."}
              </div>
            )}
          </div>
        </div>

        {/* Error */}

        {error && (
          <div className="translation-error">
            {error}
          </div>
        )}

        {/* Translate Button */}

        <button
          className="translate-btn"
          onClick={translateText}
          disabled={loading}
        >
          {loading ? "Translating..." : "Translate →"}
        </button>
      </div>

      <div className="translation-note">
        <strong>🤖 AI Powered</strong>

        <p>
          BhashaSetu uses AI-powered language processing to
          translate between Hindi and English.
        </p>
      </div>
    </div>
  );
};

export default Translation;

