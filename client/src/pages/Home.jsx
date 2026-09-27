import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">

      {/* HERO */}
      <section className="home-hero">

        <div className="home-hero-content">

          <span className="home-badge">
            🇮🇳 AI-Powered Vernacular Learning
          </span>

          <h1>
            Learn, Communicate &
            <span> Translate Without Language Barriers.</span>
          </h1>

          <p>
            BhashaSetu uses AI, NLP, speech technology and
            offline learning to help people learn and
            communicate in their preferred language.
          </p>

          <div className="home-buttons">

            <Link
              to="/learn"
              className="home-primary-btn"
            >
              Start Learning →
            </Link>

            <Link
              to="/translation"
              className="home-secondary-btn"
            >
              Try Translation
            </Link>

          </div>

          <div className="home-stats">

            <div>
              <strong>AI</strong>
              <span>Powered Learning</span>
            </div>

            <div>
              <strong>🌐</strong>
              <span>Real-Time Translation</span>
            </div>

            <div>
              <strong>📴</strong>
              <span>Offline Support</span>
            </div>

          </div>

        </div>

        {/* HERO VISUAL */}

        <div className="home-visual">

          <div className="language-card language-card-one">

            <div className="language-avatar">
              🇮🇳
            </div>

            <div>
              <small>Hindi</small>
              <strong>
                नमस्ते, आप कैसे हैं?
              </strong>
            </div>

          </div>

          <div className="translation-arrow">
            ⇄
          </div>

          <div className="language-card language-card-two">

            <div className="language-avatar">
              🇬🇧
            </div>

            <div>
              <small>English</small>
              <strong>
                Hello, how are you?
              </strong>
            </div>

          </div>

          <div className="ai-center">

            <div className="ai-icon">
              AI
            </div>

            <strong>BhashaSetu</strong>

            <span>
              Language Bridge
            </span>

          </div>

        </div>

      </section>

      {/* PROBLEM */}
      <section className="problem-section">

        <div className="section-heading">

          <span>THE PROBLEM</span>

          <h2>
            Language should never stop
            someone from learning.
          </h2>

          <p>
            Millions of learners face difficulties because
            educational content and communication are often
            available in languages they are not comfortable with.
          </p>

        </div>

        <div className="problem-grid">

          <div className="problem-card">
            <span>🌐</span>
            <h3>Language Barrier</h3>
            <p>
              Learners may struggle to understand
              educational content in unfamiliar languages.
            </p>
          </div>

          <div className="problem-card">
            <span>🎤</span>
            <h3>Communication Gap</h3>
            <p>
              Different languages can make real-time
              communication difficult.
            </p>
          </div>

          <div className="problem-card">
            <span>📶</span>
            <h3>Limited Connectivity</h3>
            <p>
              Poor internet connectivity can make
              digital learning difficult.
            </p>
          </div>

        </div>

      </section>

      {/* SOLUTION */}
      <section className="solution-section">

        <div className="section-heading">

          <span>OUR SOLUTION</span>

          <h2>
            One platform for
            multilingual learning.
          </h2>

          <p>
            BhashaSetu combines AI, NLP, speech technology
            and offline capabilities into one accessible platform.
          </p>

        </div>

        <div className="solution-grid">

          <Link
            to="/learn"
            className="solution-card"
          >
            <div className="solution-icon">
              📚
            </div>

            <h3>
              Vernacular Learning
            </h3>

            <p>
              Learn concepts in simple regional languages
              with structured lessons and educational content.
            </p>

            <span>
              Explore Learning →
            </span>
          </Link>

          <Link
            to="/ai-tutor"
            className="solution-card"
          >
            <div className="solution-icon">
              🤖
            </div>

            <h3>
              AI Tutor
            </h3>

            <p>
              Ask questions and get simple,
              personalized explanations from an AI tutor.
            </p>

            <span>
              Ask AI →
            </span>
          </Link>

          <Link
            to="/translation"
            className="solution-card"
          >
            <div className="solution-icon">
              🌐
            </div>

            <h3>
              Real-Time Translation
            </h3>

            <p>
              Translate text and speech between
              supported languages quickly.
            </p>

            <span>
              Translate →
            </span>
          </Link>

          <Link
            to="/voice"
            className="solution-card"
          >
            <div className="solution-icon">
              🎤
            </div>

            <h3>
              Speech AI
            </h3>

            <p>
              Convert speech into text and generate
              translated speech using AI.
            </p>

            <span>
              Try Voice AI →
            </span>
          </Link>

          <Link
            to="/offline-learning"
            className="solution-card"
          >
            <div className="solution-icon">
              📴
            </div>

            <h3>
              Offline Learning
            </h3>

            <p>
              Access saved educational content even
              with limited or unavailable internet.
            </p>

            <span>
              Explore Offline →
            </span>
          </Link>

          <Link
            to="/Calls"
            className="solution-card featured-solution"
          >
            <div className="solution-icon">
              📹
            </div>

            <h3>
              Live Communication
            </h3>

            <p>
              Voice and video communication with
              real-time multilingual translation.
            </p>

            <span>
              Start Communication →
            </span>
          </Link>

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">

        <div className="section-heading">

          <span>HOW IT WORKS</span>

          <h2>
            From your language
            to theirs.
          </h2>

        </div>

        <div className="how-grid">

          <div className="how-step">

            <div className="step-number">
              01
            </div>

            <div className="step-icon">
              🎤
            </div>

            <h3>
              Speak or Type
            </h3>

            <p>
              Enter your question, lesson request
              or message using text or voice.
            </p>

          </div>

          <div className="how-line" />

          <div className="how-step">

            <div className="step-number">
              02
            </div>

            <div className="step-icon">
              🧠
            </div>

            <h3>
              AI Understands
            </h3>

            <p>
              NLP and AI understand the language
              and context of the input.
            </p>

          </div>

          <div className="how-line" />

          <div className="how-step">

            <div className="step-number">
              03
            </div>

            <div className="step-icon">
              🌐
            </div>

            <h3>
              Translate
            </h3>

            <p>
              The system converts the content
              into the selected language.
            </p>

          </div>

          <div className="how-line" />

          <div className="how-step">

            <div className="step-number">
              04
            </div>

            <div className="step-icon">
              🔊
            </div>

            <h3>
              Listen & Learn
            </h3>

            <p>
              Receive the result as text, voice
              or learning content.
            </p>

          </div>

        </div>

      </section>

      {/* TECHNOLOGY */}
      <section className="technology-section">

        <div className="technology-content">

          <span className="technology-label">
            TECHNOLOGY
          </span>

          <h2>
            Built with modern
            AI technologies.
          </h2>

          <p>
            BhashaSetu combines modern web technologies
            with AI, NLP and speech processing to create
            an accessible multilingual learning experience.
          </p>

        </div>

        <div className="technology-grid">

          <div>
            <strong>⚛️</strong>
            <span>React</span>
          </div>

          <div>
            <strong>🟢</strong>
            <span>Node.js</span>
          </div>

          <div>
            <strong>🧠</strong>
            <span>NLP / LLM</span>
          </div>

          <div>
            <strong>🎤</strong>
            <span>Speech AI</span>
          </div>

          <div>
            <strong>📡</strong>
            <span>WebRTC</span>
          </div>

          <div>
            <strong>📴</strong>
            <span>Offline PWA</span>
          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="home-cta">

        <div>

          <span>
            BHASHASETU
          </span>

          <h2>
            Learn in your language.
            Communicate without barriers.
          </h2>

          <p>
            Start exploring AI-powered vernacular learning
            and multilingual communication.
          </p>

          <Link
            to="/learn"
            className="cta-button"
          >
            Start Learning →
          </Link>

        </div>

      </section>

    </div>
  );
};

export default Home;