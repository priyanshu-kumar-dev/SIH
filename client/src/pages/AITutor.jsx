import React, { useState } from "react";
import API from "../services/api";
import "./AITutor.css";

const AITutor = () => {
const [question, setQuestion] = useState("");
const [answer, setAnswer] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const askAI = async () => {
const cleanQuestion = question.trim();


if (!cleanQuestion) {
  setError("Please enter a question.");
  return;
}

setLoading(true);
setError("");
setAnswer("");

try {
  const response = await API.post("/ai/ask", {
    question: cleanQuestion,
    language: "English",
  });

  if (response.data?.answer) {
    setAnswer(response.data.answer);
  } else {
    setError("AI did not return an answer.");
  }
} catch (err) {
  console.error("AI TUTOR ERROR:", err);
  console.error("SERVER RESPONSE:", err.response?.data);

  setError(
    err.response?.data?.message ||
      "AI Tutor failed. Please try again."
  );
} finally {
  setLoading(false);
}


};

const clearQuestion = () => {
setQuestion("");
setAnswer("");
setError("");
};

const useExample = (text) => {
setQuestion(text);
setAnswer("");
setError("");
};

const handleKeyDown = (e) => {
if (e.key === "Enter" && !e.shiftKey) {
e.preventDefault();
askAI();
}
};

return ( <div className="tutor-page">


  <section className="tutor-header">

    <span className="tutor-badge">
      🤖 AI POWERED EDUCATION
    </span>

    <h1>
      Learn with your
      <span> AI Tutor</span>
    </h1>

    <p>
      Ask questions in simple language and get clear,
      easy-to-understand explanations.
    </p>

  </section>

  <div className="tutor-container">

    <div className="tutor-card">

      <div className="tutor-card-header">

        <div className="tutor-avatar">
          🤖
        </div>

        <div>
          <h2>BhashaSetu AI Tutor</h2>
          <p>Your personal learning assistant</p>
        </div>

        <span className="online-dot">
          ● Online
        </span>

      </div>

      <div className="question-area">

        <label htmlFor="question">
          Ask your question
        </label>

        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Example: What is JavaScript?"
          maxLength={1000}
        />

        <div className="question-actions">

          <span>
            {question.length} / 1000 characters
          </span>

          <div>

            <button
              type="button"
              className="clear-btn"
              onClick={clearQuestion}
              disabled={!question && !answer}
            >
              Clear
            </button>

            <button
              type="button"
              className="ask-btn"
              onClick={askAI}
              disabled={loading || !question.trim()}
            >
              {loading ? "Thinking..." : "Ask AI →"}
            </button>

          </div>

        </div>

      </div>

      {error && (
        <div className="tutor-error">
          {error}
        </div>
      )}

      {answer && (
        <div className="answer-card">

          <div className="answer-header">

            <div className="answer-avatar">
              🤖
            </div>

            <div>
              <strong>AI Tutor</strong>
              <span>Simple explanation</span>
            </div>

          </div>

          <div className="answer-content">
            {answer}
          </div>

        </div>
      )}

    </div>

    <div className="examples-card">

      <h3>Try asking the AI Tutor</h3>

      <p>
        Select a question or write your own.
      </p>

      <div className="example-list">

        <button
          onClick={() => useExample("What is JavaScript?")}
        >
          <span>💻</span>
          <b>What is JavaScript?</b>
          <strong>→</strong>
        </button>

        <button
          onClick={() => useExample("Explain photosynthesis in simple language.")}
        >
          <span>🌱</span>
          <b>Explain photosynthesis</b>
          <strong>→</strong>
        </button>

        <button
          onClick={() => useExample("What is artificial intelligence?")}
        >
          <span>🧠</span>
          <b>What is AI?</b>
          <strong>→</strong>
        </button>

        <button
          onClick={() => useExample("Explain Newton's laws of motion.")}
        >
          <span>⚙️</span>
          <b>Explain Newton's laws</b>
          <strong>→</strong>
        </button>

      </div>

    </div>

  </div>

  <section className="tutor-features">

    <div className="tutor-feature">
      <span>🌐</span>

      <div>
        <h3>Multilingual</h3>
        <p>
          Learn concepts in your preferred language.
        </p>
      </div>
    </div>

    <div className="tutor-feature">
      <span>💡</span>

      <div>
        <h3>Simple Explanations</h3>
        <p>
          Difficult concepts explained in easy language.
        </p>
      </div>
    </div>

    <div className="tutor-feature">
      <span>⚡</span>

      <div>
        <h3>Instant Answers</h3>
        <p>
          Ask questions and receive AI-powered answers.
        </p>
      </div>
    </div>

  </section>

</div>


);
};

export default AITutor;
