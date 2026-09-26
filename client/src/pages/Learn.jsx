import React, { useState } from "react";
import "./Learn.css";

const lessons = {
  Hindi: [
    {
      id: 1,
      subject: "Computer Science",
      title: "JavaScript kya hai?",
      level: "Beginner",
      duration: "10 min",
      icon: "💻",
      description:
        "JavaScript ek programming language hai jo websites aur web applications ko interactive banane ke liye use hoti hai.",
      points: [
        "JavaScript websites ko interactive banata hai.",
        "JavaScript browser aur server dono par run ho sakta hai.",
        "React aur Node.js jaise technologies JavaScript use karti hain.",
      ],
    },
    {
      id: 2,
      subject: "Science",
      title: "Photosynthesis kya hai?",
      level: "Beginner",
      duration: "8 min",
      icon: "🌱",
      description:
        "Photosynthesis ek process hai jisme green plants sunlight ki help se apna food banate hain.",
      points: [
        "Plants sunlight ka use karte hain.",
        "Carbon dioxide aur water important components hain.",
        "Is process mein oxygen release hoti hai.",
      ],
    },
    {
      id: 3,
      subject: "Mathematics",
      title: "Percentage samjho",
      level: "Beginner",
      duration: "12 min",
      icon: "📐",
      description:
        "Percentage kisi quantity ko 100 ke base par represent karne ka tarika hai.",
      points: [
        "Percentage ka symbol % hota hai.",
        "50% ka matlab 50 out of 100 hai.",
        "Percentage ka use profit, loss aur marks mein hota hai.",
      ],
    },
  ],

  English: [
    {
      id: 1,
      subject: "Computer Science",
      title: "What is JavaScript?",
      level: "Beginner",
      duration: "10 min",
      icon: "💻",
      description:
        "JavaScript is a programming language used to make websites and web applications interactive.",
      points: [
        "JavaScript makes websites interactive.",
        "JavaScript can run in browsers and on servers.",
        "Technologies such as React and Node.js use JavaScript.",
      ],
    },
    {
      id: 2,
      subject: "Science",
      title: "What is Photosynthesis?",
      level: "Beginner",
      duration: "8 min",
      icon: "🌱",
      description:
        "Photosynthesis is the process through which green plants make their food using sunlight.",
      points: [
        "Plants use sunlight as an energy source.",
        "Carbon dioxide and water are important components.",
        "Oxygen is released during the process.",
      ],
    },
    {
      id: 3,
      subject: "Mathematics",
      title: "Understanding Percentage",
      level: "Beginner",
      duration: "12 min",
      icon: "📐",
      description:
        "Percentage is a way of representing a quantity out of 100.",
      points: [
        "Percentage is represented using the % symbol.",
        "50% means 50 out of 100.",
        "Percentage is used in marks, profit and loss.",
      ],
    },
  ],
};

const Learn = () => {
  const [language, setLanguage] = useState("Hindi");
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);

  const currentLessons = lessons[language];

  const markComplete = (id) => {
    if (!completedLessons.includes(id)) {
      setCompletedLessons((prev) => [...prev, id]);
    }

    setSelectedLesson(null);
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    setSelectedLesson(null);
  };

  const progress = Math.round(
    (completedLessons.length / currentLessons.length) * 100
  );

  return (
    <div className="learn-page">

      <section className="learn-hero">

        <div className="learn-hero-content">

          <span className="learn-badge">
            📚 Vernacular Learning
          </span>

          <h1>
            Learn in your
            <span> own language.</span>
          </h1>

          <p>
            Learn concepts in simple language with
            AI-powered educational content designed
            for regional language learners.
          </p>

          <div className="language-switcher">

            <button
              type="button"
              className={language === "Hindi" ? "active" : ""}
              onClick={() => changeLanguage("Hindi")}
            >
              🇮🇳 Hindi
            </button>

            <button
              type="button"
              className={language === "English" ? "active" : ""}
              onClick={() => changeLanguage("English")}
            >
              🇬🇧 English
            </button>

          </div>

        </div>

        <div className="learn-hero-card">

          <div className="learning-icon">
            🧠
          </div>

          <h2>
            {language === "Hindi"
              ? "Smart Learning"
              : "Smart Learning"}
          </h2>

          <p>
            {language === "Hindi"
              ? "Apni language mein concepts ko easily samjho."
              : "Understand concepts easily in your preferred language."}
          </p>

          <div className="progress-box">

            <div className="progress-header">
              <span>Learning Progress</span>
              <strong>{progress}%</strong>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

          </div>

        </div>

      </section>

      <section className="learn-section">

        <div className="section-heading">

          <div>
            <span className="section-label">
              LESSONS
            </span>

            <h2>
              {language === "Hindi"
                ? "Aaj kya seekhna hai?"
                : "What do you want to learn today?"}
            </h2>
          </div>

          <span className="lesson-count">
            {currentLessons.length} Lessons
          </span>

        </div>

        <div className="lesson-grid">

          {currentLessons.map((lesson) => {

            const completed = completedLessons.includes(
              lesson.id
            );

            return (
              <div
                className={`lesson-card ${
                  completed ? "completed" : ""
                }`}
                key={lesson.id}
              >

                <div className="lesson-top">

                  <div className="lesson-icon">
                    {lesson.icon}
                  </div>

                  {completed && (
                    <span className="completed-badge">
                      ✓ Completed
                    </span>
                  )}

                </div>

                <span className="lesson-subject">
                  {lesson.subject}
                </span>

                <h3>
                  {lesson.title}
                </h3>

                <p>
                  {lesson.description}
                </p>

                <div className="lesson-meta">

                  <span>
                    🟢 {lesson.level}
                  </span>

                  <span>
                    ⏱️ {lesson.duration}
                  </span>

                </div>

                <button
                  type="button"
                  className="lesson-button"
                  onClick={() => setSelectedLesson(lesson)}
                >
                  {completed
                    ? "Review Lesson"
                    : "Start Lesson →"}
                </button>

              </div>
            );
          })}

        </div>

      </section>

      <section className="learn-features">

        <div className="learn-feature">

          <span>🌐</span>

          <div>
            <h3>Vernacular Learning</h3>
            <p>
              Concepts ko learner ki preferred language
              mein explain kiya ja sakta hai.
            </p>
          </div>

        </div>

        <div className="learn-feature">

          <span>🤖</span>

          <div>
            <h3>AI Assisted</h3>
            <p>
              AI difficult concepts ko simple examples
              ke saath explain kar sakta hai.
            </p>
          </div>

        </div>

        <div className="learn-feature">

          <span>📴</span>

          <div>
            <h3>Offline Ready</h3>
            <p>
              Basic learning content ko offline access
              ke liye save kiya ja sakta hai.
            </p>
          </div>

        </div>

      </section>

      {selectedLesson && (

        <div
          className="lesson-modal-overlay"
          onClick={() => setSelectedLesson(null)}
        >

          <div
            className="lesson-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              type="button"
              className="modal-close"
              onClick={() => setSelectedLesson(null)}
            >
              ×
            </button>

            <div className="modal-icon">
              {selectedLesson.icon}
            </div>

            <span className="lesson-subject">
              {selectedLesson.subject}
            </span>

            <h2>
              {selectedLesson.title}
            </h2>

            <p className="modal-description">
              {selectedLesson.description}
            </p>

            <div className="lesson-points">

              {selectedLesson.points.map(
                (point, index) => (
                  <div
                    className="lesson-point"
                    key={index}
                  >
                    <span>✓</span>
                    <p>{point}</p>
                  </div>
                )
              )}

            </div>

            <button
              type="button"
              className="complete-button"
              onClick={() =>
                markComplete(selectedLesson.id)
              }
            >
              ✓ Mark Lesson Complete
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default Learn;