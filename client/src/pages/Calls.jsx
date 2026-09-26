import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Calls.css";

const recentUsers = [
  {
    id: 1,
    name: "Rahul Sharma",
    contact: "Interview Room",
    avatar: "RS",
  },
  {
    id: 2,
    name: "Ankit Kumar",
    contact: "Interview Room",
    avatar: "AK",
  },
  {
    id: 3,
    name: "Neha Singh",
    contact: "Interview Room",
    avatar: "NS",
  },
];

const Calls = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [fromLanguage, setFromLanguage] = useState("Hindi");
  const [toLanguage, setToLanguage] = useState("English");
  const [message, setMessage] = useState("");

  /* =========================
     CREATE ROOM
  ========================= */

  const generateRoomId = () => {
    return (
      "BS-" +
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()
    );
  };

  /* =========================
     START CALL
  ========================= */

  const startCall = (type) => {
    const newRoomId = generateRoomId();

    setRoomId(newRoomId);

    const callType = type === "video" ? "video" : "voice";

    navigate(
      `/interview/${newRoomId}?type=${callType}&from=${encodeURIComponent(
        fromLanguage
      )}&to=${encodeURIComponent(toLanguage)}`
    );
  };

  /* =========================
     JOIN ROOM
  ========================= */

  const joinRoom = () => {
    const value = roomId.trim();

    if (!value) {
      setMessage("Please enter an Interview Room ID.");
      return;
    }

    navigate(
      `/interview/${value}?type=video&from=${encodeURIComponent(
        fromLanguage
      )}&to=${encodeURIComponent(toLanguage)}`
    );
  };

  /* =========================
     COPY ROOM LINK
  ========================= */

  const copyRoomLink = async () => {
    if (!roomId) {
      setMessage("Create an interview room first.");
      return;
    }

    const link = `${window.location.origin}/interview/${roomId}`;

    try {
      await navigator.clipboard.writeText(link);

      setMessage("Interview link copied successfully.");
    } catch (error) {
      console.error("Copy error:", error);

      setMessage("Unable to copy the interview link.");
    }
  };

  /* =========================
     SELECT RECENT USER
  ========================= */

  const selectRecentUser = () => {
    const newRoomId = generateRoomId();

    setRoomId(newRoomId);

    setMessage(
      "Interview room created. Share the room link with the interviewer."
    );
  };

  /* =========================
     SWAP LANGUAGES
  ========================= */

  const swapLanguages = () => {
    setFromLanguage(toLanguage);
    setToLanguage(fromLanguage);
  };

  return (
    <div className="calls-page">
      {/* =========================
          HEADER
      ========================= */}

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
          Create a secure interview room and communicate
          through real-time voice or video calls.
        </p>
      </div>

      <div className="call-container">
        {/* =========================
            CALL CARD
        ========================= */}

        <div className="call-card">
          <div className="call-card-header">
            <div className="call-icon">📞</div>

            <div>
              <h2>Start a Conversation</h2>

              <p>
                Create or join an interview room
              </p>
            </div>
          </div>

          {/* =========================
              ROOM SECTION
          ========================= */}

          <div className="user-search">
            <span>🔗</span>

            <input
              type="text"
              value={roomId}
              onChange={(e) => {
                setRoomId(e.target.value);
                setMessage("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  joinRoom();
                }
              }}
              placeholder="Enter Interview Room ID"
            />

            <button
              type="button"
              className="search-user-btn"
              onClick={joinRoom}
            >
              Join
            </button>
          </div>

          {message && (
            <div className="call-status">
              {message}
            </div>
          )}

          {/* =========================
              LANGUAGE SECTION
          ========================= */}

          <div className="language-section">
            <label>Interview Languages</label>

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
                  <option value="Chinese">Chinese</option>
                  <option value="Russian">Russian</option>
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
                  <option value="Chinese">Chinese</option>
                  <option value="Russian">Russian</option>
                </select>
              </div>
            </div>
          </div>

          {/* =========================
              CALL BUTTONS
          ========================= */}

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

          {/* =========================
              ROOM LINK
          ========================= */}

          {roomId && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                borderRadius: "12px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <strong>Interview Room</strong>

              <p
                style={{
                  margin: "8px 0",
                  fontWeight: "600",
                }}
              >
                {roomId}
              </p>

              <button
                type="button"
                onClick={copyRoomLink}
                style={{
                  padding: "9px 14px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  background: "#2563eb",
                  color: "#fff",
                }}
              >
                🔗 Copy Interview Link
              </button>
            </div>
          )}

          {/* =========================
              RECENT INTERVIEWS
          ========================= */}

          <div className="recent-section">
            <h3>Recent Interviews</h3>

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
                  onClick={selectRecentUser}
                >
                  Create
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* =========================
            TRANSLATION INFO
        ========================= */}

        <div className="call-info-card">
          <h2>🌐 Real-Time Translation</h2>

          <p>
            Speak naturally in your language. BhashaSetu
            will translate the conversation in real time.
          </p>

          <div className="call-feature">
            <div className="call-feature-icon">
              🎤
            </div>

            <div>
              <strong>Speech Recognition</strong>

              <p>
                Your voice can be converted into text
                using Speech AI.
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
                AI can translate the conversation between
                selected languages.
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
                into natural speech.
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