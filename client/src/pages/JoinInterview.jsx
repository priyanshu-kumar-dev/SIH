import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinInterview = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");

  const joinInterview = () => {
    const cleanRoomId = roomId.trim();

    if (!cleanRoomId) {
      alert("Please enter Room ID");
      return;
    }

    navigate(`/interview/${cleanRoomId}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          width: "400px",
          background: "white",
          padding: "35px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h1>Join Interview</h1>

        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            marginBottom: "15px",
            boxSizing: "border-box",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
          }}
        />

        <button
          onClick={joinInterview}
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            background: "#2563eb",
            color: "white",
          }}
        >
          Join Interview
        </button>
      </div>
    </div>
  );
};

export default JoinInterview;