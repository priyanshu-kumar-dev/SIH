import React, { useState } from "react";
import "./OfflineLearning.css";

const lessons = [
{
id: 1,
title: "JavaScript Basics",
category: "Programming",
language: "English",
icon: "💻",
level: "Beginner",
content:
"JavaScript is a programming language used to make websites interactive.",
example: 'let name = "Priyanshu";\nconsole.log(name);',
},
{
id: 2,
title: "JavaScript Variables",
category: "Programming",
language: "English",
icon: "📦",
level: "Beginner",
content:
"A variable is used to store data. In JavaScript, we commonly use let, const and var.",
example: 'let age = 20;\nconst name = "Priyanshu";',
},
{
id: 3,
title: "What is HTML?",
category: "Web Development",
language: "English",
icon: "🌐",
level: "Beginner",
content:
"HTML is used to create the structure of a web page.",
example: "<h1>Hello World</h1>",
},
{
id: 4,
title: "What is CSS?",
category: "Web Development",
language: "English",
icon: "🎨",
level: "Beginner",
content:
"CSS is used to style and design HTML elements.",
example: "h1 {\n  color: blue;\n}",
},
{
id: 5,
title: "JavaScript क्या है?",
category: "Programming",
language: "Hindi",
icon: "🇮🇳",
level: "Beginner",
content:
"JavaScript एक programming language है जिसका उपयोग websites को interactive बनाने के लिए किया जाता है।",
example: 'let name = "Priyanshu";\nconsole.log(name);',
},
{
id: 6,
title: "Variable क्या है?",
category: "Programming",
language: "Hindi",
icon: "📚",
level: "Beginner",
content:
"Variable एक container की तरह होता है जिसमें हम data store कर सकते हैं।",
example: 'let age = 20;\nconst city = "Jaipur";',
},
];

const OfflineLearning = () => {
const [selectedLesson, setSelectedLesson] = useState(null);
const [search, setSearch] = useState("");
const [language, setLanguage] = useState("All");

const filteredLessons = lessons.filter((lesson) => {
const searchValue = search.toLowerCase().trim();


const matchesSearch =
  lesson.title.toLowerCase().includes(searchValue) ||
  lesson.category.toLowerCase().includes(searchValue) ||
  lesson.content.toLowerCase().includes(searchValue);

const matchesLanguage =
  language === "All" || lesson.language === language;

return matchesSearch && matchesLanguage;


});

if (selectedLesson) {
return ( <div className="offline-page"> <div className="lesson-detail">
<button
className="back-button"
onClick={() => setSelectedLesson(null)}
type="button"
>
← Back to Lessons </button>


      <div className="detail-card">
        <div className="detail-top">
          <div className="detail-icon">
            {selectedLesson.icon}
          </div>

          <div className="detail-meta">
            <span>{selectedLesson.category}</span>
            <span>{selectedLesson.language}</span>
            <span>{selectedLesson.level}</span>
          </div>
        </div>

        <h1>{selectedLesson.title}</h1>

        <p className="detail-content">
          {selectedLesson.content}
        </p>

        <div className="learning-section">
          <div className="section-title">
            <span>💡</span>
            <div>
              <h3>Example</h3>
              <p>Try to understand this simple example.</p>
            </div>
          </div>

          <pre>
            <code>{selectedLesson.example}</code>
          </pre>
        </div>

        <div className="offline-note">
          <span>📱</span>
          <div>
            <strong>Available Offline</strong>
            <p>
              This lesson is stored locally on your device.
              You can continue learning without an internet connection.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);


}

return ( <div className="offline-page"> <section className="offline-header"> <span className="offline-badge">
📚 Offline Learning </span>


    <h1>
      Learn Anywhere.
      <span> Even Offline.</span>
    </h1>

    <p>
      Access educational lessons in regional languages even
      when internet connectivity is limited or unavailable.
    </p>
  </section>

  <div className="offline-stats">
    <div className="offline-stat">
      <span>📚</span>
      <div>
        <strong>{lessons.length}+</strong>
        <small>Lessons</small>
      </div>
    </div>

    <div className="offline-stat">
      <span>🌐</span>
      <div>
        <strong>2</strong>
        <small>Languages</small>
      </div>
    </div>

    <div className="offline-stat">
      <span>📡</span>
      <div>
        <strong>100%</strong>
        <small>Offline Ready</small>
      </div>
    </div>
  </div>

  <div className="offline-controls">
    <div className="search-box">
      <span>⌕</span>

      <input
        type="text"
        placeholder="Search lessons, topics..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {search && (
        <button
          type="button"
          onClick={() => setSearch("")}
        >
          ×
        </button>
      )}
    </div>

    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
    >
      <option value="All">All Languages</option>
      <option value="English">English</option>
      <option value="Hindi">Hindi</option>
    </select>
  </div>

  <div className="offline-status">
    <span className="status-dot"></span>
    <strong>Offline Mode Active</strong>
    <span>
      Lessons available on this device
    </span>
  </div>

  <div className="lessons-heading">
    <div>
      <h2>Learning Library</h2>
      <p>
        Choose a lesson and start learning.
      </p>
    </div>

    <span>
      {filteredLessons.length} lessons
    </span>
  </div>

  {filteredLessons.length > 0 ? (
    <div className="lesson-grid">
      {filteredLessons.map((lesson) => (
        <article
          className="lesson-card"
          key={lesson.id}
          onClick={() => setSelectedLesson(lesson)}
        >
          <div className="lesson-card-top">
            <div className="lesson-icon">
              {lesson.icon}
            </div>

            <span className="lesson-level">
              {lesson.level}
            </span>
          </div>

          <span className="lesson-category">
            {lesson.category}
          </span>

          <h2>{lesson.title}</h2>

          <p>{lesson.content}</p>

          <div className="lesson-footer">
            <div className="lesson-language">
              <span>🌐</span>
              {lesson.language}
            </div>

            <button type="button">
              Learn →
            </button>
          </div>
        </article>
      ))}
    </div>
  ) : (
    <div className="no-lessons">
      <div>🔎</div>
      <h2>No lessons found</h2>
      <p>
        Try searching for another topic or change the language filter.
      </p>

      <button
        type="button"
        onClick={() => {
          setSearch("");
          setLanguage("All");
        }}
      >
        Reset Search
      </button>
    </div>
  )}

  <div className="offline-footer-card">
    <div className="footer-icon">📡</div>

    <div>
      <h3>Designed for low-connectivity areas</h3>
      <p>
        BhashaSetu keeps essential learning resources available
        even when students have limited or no internet access.
      </p>
    </div>

    <span className="footer-check">✓ Offline Ready</span>
  </div>
</div>


);
};

export default OfflineLearning;
