import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateInterview = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");

  const createRoom = () => {
    const randomRoomId =
      "BS-" +
      Math.random().toString(36).substring(2, 8).toUpperCase();

    setRoomId(randomRoomId);
  };

  const joinRoom = () => {
    if (!roomId) return;

    navigate(`/interview/${roomId}`);
  };

  const copyLink = async () => {
    const link = `${window.location.origin}/interview/${roomId}`;

    await navigator.clipboard.writeText(link);

    alert("Interview link copied!");
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
          textAlign: "center",
        }}
      >
        <h1>Create Interview</h1>

        {!roomId ? (
          <button
            onClick={createRoom}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              background: "#2563eb",
              color: "white",
            }}
          >
            Create Interview Room
          </button>
        ) : (
          <>
            <p>Share this Room ID:</p>

            <h2>{roomId}</h2>

            <button
              onClick={copyLink}
              style={{
                padding: "10px 16px",
                marginRight: "10px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Copy Link
            </button>

            <button
              onClick={joinRoom}
              style={{
                padding: "10px 16px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                background: "#2563eb",
                color: "white",
              }}
            >
              Start Interview
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateInterview;