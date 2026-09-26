import React, { useState } from "react";
import "./Calls.css";

const recentUsers = [
  {
    id: 1,
    name: "Rahul Sharma",
    contact: "rahul@example.com",
    avatar: "RS",
  },
  {
    id: 2,
    name: "Ankit Kumar",
    contact: "+91 98765 43210",
    avatar: "AK",
  },
  {
    id: 3,
    name: "Neha Singh",
    contact: "neha@example.com",
    avatar: "NS",
  },
];

const Calls = () => {
  const [contact, setContact] = useState("");
  const [fromLanguage, setFromLanguage] = useState("Hindi");
  const [toLanguage, setToLanguage] = useState("English");
  const [message, setMessage] = useState("");

  const searchUser = () => {
    const value = contact.trim();

    if (!value) {
      setMessage("Please enter a mobile number or email.");
      return;
    }

    setMessage(`Searching for ${value}...`);
  };

  const startCall = (type) => {
    if (!contact.trim()) {
      setMessage("Please enter a mobile number or email first.");
      return;
    }

    const callType = type === "video" ? "Video" : "Voice";

    setMessage(
      `${callType} call request ready for ${contact}.`
    );
  };

  const selectRecentUser = (user) => {
    setContact(user.contact);
    setMessage("");
  };

  const swapLanguages = () => {
    setFromLanguage(toLanguage);
    setToLanguage(fromLanguage);
  };

  return (
    <div className="calls-page">
      <div className="calls-header">
        <span className="calls-badge">
          📞 BhashaSetu Connect
        </span>

        <h1>
          Talk Without
          <br />
          <span>Language Barriers.</span>
        </h1>

        <p>
          Make voice or video calls and communicate across
          languages with AI-powered real-time translation.
        </p>
      </div>

      <div className="call-container">
        <div className="call-card">
          <div className="call-card-header">
            <div className="call-icon">📞</div>

            <div>
              <h2>Start a Conversation</h2>
              <p>
                Connect using a mobile number or email
              </p>
            </div>
          </div>

          <div className="user-search">
            <span>🔎</span>

            <input
              type="text"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                setMessage("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchUser();
                }
              }}
              placeholder="Mobile number or email"
            />

            <button
              type="button"
              className="search-user-btn"
              onClick={searchUser}
            >
              Search
            </button>
          </div>

          {message && (
            <div className="call-status">
              {message}
            </div>
          )}

          <div className="language-section">
            <label>Live Translation Languages</label>

            <div className="language-selects">
              <div className="language-box">
                <span>You speak</span>

                <select
                  value={fromLanguage}
                  onChange={(e) =>
                    setFromLanguage(e.target.value)
                  }
                >
                  <option value="Hindi">Hindi</option>
                  <option value="English">English</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Tamil">Tamil</option>
                </select>
              </div>

              <button
                type="button"
                className="language-arrow"
                onClick={swapLanguages}
                title="Swap languages"
              >
                ⇄
              </button>

              <div className="language-box">
                <span>They speak</span>

                <select
                  value={toLanguage}
                  onChange={(e) =>
                    setToLanguage(e.target.value)
                  }
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Tamil">Tamil</option>
                </select>
              </div>
            </div>
          </div>

          <div className="call-buttons">
            <button
              type="button"
              className="voice-call-btn"
              onClick={() => startCall("voice")}
            >
              📞 Voice Call
            </button>

            <button
              type="button"
              className="video-call-btn"
              onClick={() => startCall("video")}
            >
              📹 Video Call
            </button>
          </div>

          <div className="recent-section">
            <h3>Recent Conversations</h3>

            {recentUsers.map((user) => (
              <div
                className="recent-user"
                key={user.id}
              >
                <div className="user-avatar">
                  {user.avatar}
                </div>

                <div className="recent-user-info">
                  <strong>{user.name}</strong>
                  <span>{user.contact}</span>
                </div>

                <button
                  type="button"
                  className="recent-call-btn"
                  onClick={() =>
                    selectRecentUser(user)
                  }
                >
                  Call
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="call-info-card">
          <h2>🌐 Real-Time Translation</h2>

          <p>
            Speak naturally in your language. BhashaSetu
            processes the conversation and translates it
            in real time.
          </p>

          <div className="call-feature">
            <div className="call-feature-icon">
              🎤
            </div>

            <div>
              <strong>Speech Recognition</strong>

              <p>
                Your voice is converted into text using
                Speech AI.
              </p>
            </div>
          </div>

          <div className="call-feature">
            <div className="call-feature-icon">
              🧠
            </div>

            <div>
              <strong>AI Translation</strong>

              <p>
                NLP and AI translate the conversation
                between selected languages.
              </p>
            </div>
          </div>

          <div className="call-feature">
            <div className="call-feature-icon">
              🔊
            </div>

            <div>
              <strong>Translated Voice</strong>

              <p>
                The translated message can be converted
                back into natural speech.
              </p>
            </div>
          </div>

          <div className="translation-preview">
            <span>Live Translation Preview</span>

            <p>
              नमस्ते, आप कैसे हैं?
            </p>

            <strong>
              How are you?
            </strong>
          </div>

          <div className="call-status">
            🟢 Translation service ready
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calls;