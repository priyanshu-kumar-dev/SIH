import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import VideoCall from "../components/VideoCall";
import VoiceCall from "../components/VoiceCall";

const InterviewRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  // URL se call type milega:
  // /interview/ROOM123?type=video
  // /interview/ROOM123?type=voice
  const callType = searchParams.get("type");

  // ==============================
  // END CALL
  // ==============================

  const handleEndCall = () => {
    navigate("/");
  };

  // ==============================
  // INVALID ROOM
  // ==============================

  if (!roomId) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f172a",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            background: "#1e293b",
            padding: "40px",
            borderRadius: "20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "60px",
              marginBottom: "15px",
            }}
          >
            ⚠️
          </div>

          <h1
            style={{
              margin: "0 0 10px",
            }}
          >
            Invalid Interview Room
          </h1>

          <p
            style={{
              color: "#94a3b8",
              lineHeight: "1.6",
              marginBottom: "25px",
            }}
          >
            Interview room ID is missing.
            <br />
            Please create or join an interview room again.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              padding: "12px 24px",
              border: "none",
              borderRadius: "10px",
              background: "#2563eb",
              color: "white",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            ← Go Home
          </button>
        </div>
      </div>
    );
  }

  // ==============================
  // VIDEO CALL
  // ==============================

  if (callType === "video") {
    return (
      <VideoCall
        roomId={roomId}
        onEndCall={handleEndCall}
      />
    );
  }

  // ==============================
  // VOICE CALL
  // ==============================

  if (callType === "voice") {
    return (
      <VoiceCall
        roomId={roomId}
        onEndCall={handleEndCall}
      />
    );
  }

  // ==============================
  // CALL TYPE NOT SELECTED
  // ==============================

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a, #1e293b)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          background: "#111827",
          padding: "45px 35px",
          borderRadius: "24px",
          textAlign: "center",
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.35)",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            fontSize: "55px",
            marginBottom: "10px",
          }}
        >
          🎤
        </div>

        <h1
          style={{
            margin: "0 0 10px",
            fontSize: "30px",
          }}
        >
          BhashaSetu Interview Room
        </h1>

        <p
          style={{
            color: "#94a3b8",
            margin: "0 auto 30px",
            maxWidth: "450px",
            lineHeight: "1.6",
          }}
        >
          Choose how you want to join the interview.
          You can join using video or voice call.
        </p>

        {/* ROOM ID */}

        <div
          style={{
            display: "inline-block",
            background: "#1e293b",
            padding: "10px 18px",
            borderRadius: "10px",
            marginBottom: "30px",
            color: "#cbd5e1",
            fontSize: "14px",
          }}
        >
          <strong>Room ID:</strong>{" "}
          {roomId}
        </div>

        {/* CALL OPTIONS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
          }}
        >
          {/* VIDEO CALL */}

          <button
            type="button"
            onClick={() =>
              navigate(
                `/interview/${roomId}?type=video`
              )
            }
            style={{
              minHeight: "150px",
              border: "1px solid #3b82f6",
              borderRadius: "18px",
              background:
                "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "white",
              cursor: "pointer",
              padding: "25px 20px",
              transition: "0.2s",
            }}
          >
            <div
              style={{
                fontSize: "45px",
                marginBottom: "10px",
              }}
            >
              🎥
            </div>

            <div
              style={{
                fontSize: "19px",
                fontWeight: "700",
                marginBottom: "6px",
              }}
            >
              Video Call
            </div>

            <div
              style={{
                fontSize: "13px",
                color: "#dbeafe",
              }}
            >
              Camera + Microphone
            </div>
          </button>

          {/* VOICE CALL */}

          <button
            type="button"
            onClick={() =>
              navigate(
                `/interview/${roomId}?type=voice`
              )
            }
            style={{
              minHeight: "150px",
              border: "1px solid #22c55e",
              borderRadius: "18px",
              background:
                "linear-gradient(135deg, #16a34a, #15803d)",
              color: "white",
              cursor: "pointer",
              padding: "25px 20px",
              transition: "0.2s",
            }}
          >
            <div
              style={{
                fontSize: "45px",
                marginBottom: "10px",
              }}
            >
              🎧
            </div>

            <div
              style={{
                fontSize: "19px",
                fontWeight: "700",
                marginBottom: "6px",
              }}
            >
              Voice Call
            </div>

            <div
              style={{
                fontSize: "13px",
                color: "#dcfce7",
              }}
            >
              Microphone Only
            </div>
          </button>
        </div>

        {/* INFO */}

        <p
          style={{
            marginTop: "28px",
            marginBottom: 0,
            fontSize: "12px",
            color: "#64748b",
          }}
        >
          🔒 Your interview connection is secured
          using WebRTC.
        </p>
      </div>
    </div>
  );
};

export default InterviewRoom;