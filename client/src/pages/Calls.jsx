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

  // Join popup
  const [showJoinOptions, setShowJoinOptions] = useState(false);

  // Generate Interview Room ID
  const generateRoomId = () => {
    return (
      "BS-" +
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()
    );
  };

  // =====================================================
  // OPEN INTERVIEW ROOM
  // =====================================================

  const openInterviewRoom = (id, type) => {
    const cleanRoomId = id.trim().toUpperCase();

    if (!cleanRoomId) {
      setMessage("Please enter an Interview Room ID.");
      return;
    }

    setMessage("");
    setShowJoinOptions(false);

    navigate(
      `/interview/${encodeURIComponent(
        cleanRoomId
      )}?type=${type}&from=${encodeURIComponent(
        fromLanguage
      )}&to=${encodeURIComponent(toLanguage)}`
    );
  };

  // =====================================================
  // START NEW CALL
  // =====================================================

  const startCall = (type) => {
    const newRoomId = generateRoomId();

    setRoomId(newRoomId);

    openInterviewRoom(newRoomId, type);
  };

  // =====================================================
  // JOIN ROOM
  // =====================================================

  const joinRoom = () => {
    const value = roomId.trim();

    if (!value) {
      setMessage("Please enter an Interview Room ID.");
      return;
    }

    setMessage("");

    // IMPORTANT:
    // Join click -> popup open
    // Voice / Video choose karne ke baad room open hoga
    setShowJoinOptions(true);
  };

  // =====================================================
  // COPY ROOM LINK
  // =====================================================

  const copyRoomLink = async () => {
    if (!roomId.trim()) {
      setMessage("Create an interview room first.");
      return;
    }

    const cleanRoomId = roomId.trim().toUpperCase();

    const link = `${window.location.origin}/interview/${encodeURIComponent(
      cleanRoomId
    )}?type=voice&from=${encodeURIComponent(
      fromLanguage
    )}&to=${encodeURIComponent(toLanguage)}`;

    try {
      await navigator.clipboard.writeText(link);

      setMessage(
        "Voice interview link copied successfully."
      );
    } catch (error) {
      console.error("Copy error:", error);

      setMessage(
        "Unable to copy the interview link."
      );
    }
  };

  // =====================================================
  // CREATE ROOM FROM RECENT INTERVIEW
  // =====================================================

  const selectRecentUser = () => {
    const newRoomId = generateRoomId();

    setRoomId(newRoomId);

    setMessage(
      "Interview room created. Share the room link with the interviewer."
    );
  };

  // =====================================================
  // SWAP LANGUAGES
  // =====================================================

  const swapLanguages = () => {
    setFromLanguage(toLanguage);
    setToLanguage(fromLanguage);
  };

  return (
    <div className="calls-page">

      {/* =================================================
          HEADER
      ================================================= */}

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
          Create or join a secure interview room and
          communicate through real-time voice translation.
        </p>
      </div>

      <div className="call-container">

        {/* =================================================
            LEFT CARD
        ================================================= */}

        <div className="call-card">

          <div className="call-card-header">

            <div className="call-icon">
              📞
            </div>

            <div>
              <h2>Start a Conversation</h2>

              <p>
                Create or join an interview room
              </p>
            </div>

          </div>

          {/* =================================================
              JOIN ROOM
          ================================================= */}

          <div className="user-search">

            <span>🔗</span>

            <input
              type="text"
              value={roomId}
              onChange={(e) => {
                setRoomId(
                  e.target.value.toUpperCase()
                );

                setMessage("");
                setShowJoinOptions(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  joinRoom();
                }
              }}
              placeholder="Enter Interview Room ID"
              autoComplete="off"
            />

            <button
              type="button"
              className="search-user-btn"
              onClick={joinRoom}
            >
              Join
            </button>

          </div>

          {/* MESSAGE */}

          {message && (
            <div className="call-status">
              {message}
            </div>
          )}

          {/* =================================================
              JOIN POPUP / MODAL
          ================================================= */}

          {showJoinOptions && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background:
                  "rgba(15, 23, 42, 0.65)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                padding: "20px",
              }}
            >

              <div
                style={{
                  width: "100%",
                  maxWidth: "430px",
                  background: "#ffffff",
                  borderRadius: "20px",
                  padding: "28px",
                  boxShadow:
                    "0 25px 60px rgba(0,0,0,0.25)",
                  position: "relative",
                }}
              >

                {/* CLOSE */}

                <button
                  type="button"
                  onClick={() =>
                    setShowJoinOptions(false)
                  }
                  style={{
                    position: "absolute",
                    top: "14px",
                    right: "14px",
                    width: "34px",
                    height: "34px",
                    border: "none",
                    borderRadius: "50%",
                    background: "#f1f5f9",
                    color: "#475569",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  ×
                </button>

                {/* ICON */}

                <div
                  style={{
                    width: "65px",
                    height: "65px",
                    borderRadius: "50%",
                    background: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "30px",
                    margin: "0 auto 15px",
                  }}
                >
                  📞
                </div>

                {/* TITLE */}

                <h2
                  style={{
                    margin: "0 0 8px",
                    textAlign: "center",
                    color: "#0f172a",
                  }}
                >
                  Join Interview
                </h2>

                <p
                  style={{
                    margin: "0 0 22px",
                    textAlign: "center",
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  Choose how you want to join
                </p>

                {/* ROOM ID */}

                <div
                  style={{
                    background: "#f8fafc",
                    border:
                      "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "10px",
                    textAlign: "center",
                    marginBottom: "18px",
                    fontSize: "14px",
                    color: "#475569",
                  }}
                >
                  Room:{" "}
                  <strong
                    style={{
                      color: "#0f172a",
                    }}
                  >
                    {roomId
                      .trim()
                      .toUpperCase()}
                  </strong>
                </div>

                {/* CALL OPTIONS */}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 1fr",
                    gap: "14px",
                  }}
                >

                  {/* VOICE */}

                  <button
                    type="button"
                    onClick={() =>
                      openInterviewRoom(
                        roomId,
                        "voice"
                      )
                    }
                    style={{
                      padding: "22px 12px",
                      border: "none",
                      borderRadius: "14px",
                      background: "#16a34a",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "15px",
                      transition:
                        "transform 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(0)";
                    }}
                  >
                    <div
                      style={{
                        fontSize: "32px",
                        marginBottom: "8px",
                      }}
                    >
                      🎧
                    </div>

                    Voice Call

                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: "400",
                        marginTop: "5px",
                        opacity: 0.9,
                      }}
                    >
                      Audio only
                    </div>
                  </button>

                  {/* VIDEO */}

                  <button
                    type="button"
                    onClick={() =>
                      openInterviewRoom(
                        roomId,
                        "video"
                      )
                    }
                    style={{
                      padding: "22px 12px",
                      border: "none",
                      borderRadius: "14px",
                      background: "#2563eb",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "15px",
                      transition:
                        "transform 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(0)";
                    }}
                  >
                    <div
                      style={{
                        fontSize: "32px",
                        marginBottom: "8px",
                      }}
                    >
                      🎥
                    </div>

                    Video Call

                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: "400",
                        marginTop: "5px",
                        opacity: 0.9,
                      }}
                    >
                      Audio + Video
                    </div>
                  </button>

                </div>

                {/* CANCEL */}

                <button
                  type="button"
                  onClick={() =>
                    setShowJoinOptions(false)
                  }
                  style={{
                    width: "100%",
                    marginTop: "14px",
                    padding: "11px",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius: "10px",
                    background: "white",
                    color: "#475569",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </button>

              </div>

            </div>
          )}

          {/* =================================================
              LANGUAGE SELECTION
          ================================================= */}

          <div className="language-section">

            <label>
              Interview Languages
            </label>

            <div className="language-selects">

              <div className="language-box">

                <span>You speak</span>

                <select
                  value={fromLanguage}
                  onChange={(e) =>
                    setFromLanguage(
                      e.target.value
                    )
                  }
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
                type="button"
                className="language-arrow"
                onClick={swapLanguages}
                title="Swap languages"
              >
                ⇄
              </button>

              <div className="language-box">

                <span>
                  They speak
                </span>

                <select
                  value={toLanguage}
                  onChange={(e) =>
                    setToLanguage(
                      e.target.value
                    )
                  }
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

          </div>

          {/* =================================================
              CALL BUTTONS
          ================================================= */}

          <div className="call-buttons">

            <button
              type="button"
              className="voice-call-btn"
              onClick={() =>
                startCall("voice")
              }
            >
              📞 Voice Call
            </button>

            <button
              type="button"
              className="video-call-btn"
              onClick={() =>
                startCall("video")
              }
            >
              📹 Video Call
            </button>

          </div>

          {/* =================================================
              ROOM DETAILS
          ================================================= */}

          {roomId && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                borderRadius: "12px",
                background: "#f8fafc",
                border:
                  "1px solid #e2e8f0",
              }}
            >

              <strong>
                Interview Room
              </strong>

              <p
                style={{
                  margin: "8px 0",
                  fontWeight: "600",
                }}
              >
                {roomId}
              </p>

              <p
                style={{
                  margin: "6px 0",
                  fontSize: "14px",
                  color: "#64748b",
                }}
              >
                {fromLanguage} →{" "}
                {toLanguage}
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
                🔗 Copy Voice Translation Link
              </button>

            </div>
          )}

          {/* =================================================
              RECENT INTERVIEWS
          ================================================= */}

          <div className="recent-section">

            <h3>
              Recent Interviews
            </h3>

            {recentUsers.map((user) => (
              <div
                className="recent-user"
                key={user.id}
              >

                <div className="user-avatar">
                  {user.avatar}
                </div>

                <div className="recent-user-info">

                  <strong>
                    {user.name}
                  </strong>

                  <span>
                    {user.contact}
                  </span>

                </div>

                <button
                  type="button"
                  className="recent-call-btn"
                  onClick={
                    selectRecentUser
                  }
                >
                  Create
                </button>

              </div>
            ))}

          </div>

        </div>

        {/* =================================================
            RIGHT CARD
        ================================================= */}

        <div className="call-info-card">

          <h2>
            🌐 Real-Time Voice Translation
          </h2>

          <p>
            Speak naturally in Hindi or English.
            BhashaSetu will translate the conversation
            in real time.
          </p>

          <div className="call-feature">

            <div className="call-feature-icon">
              🎤
            </div>

            <div>

              <strong>
                Speech Recognition
              </strong>

              <p>
                Your voice is converted into text
                using Speech AI.
              </p>

            </div>

          </div>

          <div className="call-feature">

            <div className="call-feature-icon">
              🧠
            </div>

            <div>

              <strong>
                AI Translation
              </strong>

              <p>
                Hindi and English speech can be
                translated between both languages.
              </p>

            </div>

          </div>

          <div className="call-feature">

            <div className="call-feature-icon">
              🔊
            </div>

            <div>

              <strong>
                Translated Voice
              </strong>

              <p>
                The translated text can be converted
                back into natural speech.
              </p>

            </div>

          </div>

          <div className="translation-preview">

            <span>
              Live Translation Preview
            </span>

            <p>
              नमस्ते, आप कैसे हैं?
            </p>

            <strong>
              How are you?
            </strong>

          </div>

          <div className="call-status">
            🟢 Hindi ↔ English translation ready
          </div>

        </div>

      </div>
    </div>
  );
};

export default Calls;