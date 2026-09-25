import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <span className="badge">AI-Powered Vernacular Learning</span>

          <h1>
            Learn, Translate &
            <span> Connect</span>
          </h1>

          <p>
            BhashaSetu helps students learn languages, translate text,
            and communicate using AI-powered voice and language tools.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">Start Learning</button>
            <button className="secondary-btn">Try Translation</button>
          </div>

          <div className="language-info">
            <span>🇮🇳 Hindi</span>
            <span>↔</span>
            <span>🇬🇧 English</span>
          </div>
        </div>

        <div className="hero-card">
          <div className="ai-circle">AI</div>

          <h2>नमस्ते 👋</h2>

          <p>
            Hello! I'm your AI language tutor.
          </p>

          <div className="translation-preview">
            <div>
              <small>Hindi</small>
              <strong>आप कैसे हैं?</strong>
            </div>

            <div className="arrow">→</div>

            <div>
              <small>English</small>
              <strong>How are you?</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Everything You Need to Learn</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Tutor</h3>
            <p>
              Learn with an AI tutor that explains concepts in simple
              language.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Translation</h3>
            <p>
              Translate between Hindi and English instantly.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎤</div>
            <h3>Voice AI</h3>
            <p>
              Speak naturally and convert your voice into translated text.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Learn Offline</h3>
            <p>
              Access basic learning content even with limited internet.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;