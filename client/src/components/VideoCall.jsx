
import React, { useEffect, useRef, useState } from "react";
import socket from "../socket";

const VideoCall = ({ roomId, onEndCall }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  // ICE candidates can arrive before remote description
  const pendingIceCandidatesRef = useRef([]);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    let mounted = true;
    let mediaStarted = false;

    const configuration = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };

    /* =========================
       CREATE PEER CONNECTION
    ========================= */

    const createPeerConnection = () => {
      if (peerConnectionRef.current) {
        return peerConnectionRef.current;
      }

      const peerConnection = new RTCPeerConnection(configuration);

      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket.connected) {
          socket.emit("ice-candidate", {
            roomId,
            candidate: event.candidate,
          });
        }
      };

      peerConnection.ontrack = (event) => {
        console.log("🎥 Remote track received");

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnection.onconnectionstatechange = () => {
        const state = peerConnection.connectionState;

        console.log("WebRTC connection state:", state);

        if (state === "connected") {
          setConnected(true);
        }

        if (
          state === "disconnected" ||
          state === "failed" ||
          state === "closed"
        ) {
          setConnected(false);
        }
      };

      peerConnection.oniceconnectionstatechange = () => {
        console.log(
          "ICE connection state:",
          peerConnection.iceConnectionState
        );
      };

      peerConnectionRef.current = peerConnection;

      return peerConnection;
    };

    /* =========================
       START CAMERA + MIC
    ========================= */

    const startMedia = async () => {
      if (mediaStarted) return;

      try {
        mediaStarted = true;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const peerConnection = createPeerConnection();

        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });

        /* =========================
           IMPORTANT:
           CONNECT FIRST, THEN JOIN
        ========================= */

        const joinRoom = () => {
          if (!socket.connected) return;

          console.log("🚪 Joining room:", roomId);

          socket.emit("join-room", {
            roomId,
          });
        };

        if (socket.connected) {
          joinRoom();
        } else {
          socket.once("connect", joinRoom);
          socket.connect();
        }
      } catch (error) {
        console.error("Camera/Microphone error:", error);

        mediaStarted = false;

        alert(
          "Camera aur microphone permission allow karo, phir page reload karo."
        );
      }
    };

    /* =========================
       USER JOINED
       FIRST USER CREATES OFFER
    ========================= */

    const handleUserJoined = async ({ socketId }) => {
      console.log("👤 New user joined:", socketId);

      try {
        const peerConnection = createPeerConnection();

        const offer = await peerConnection.createOffer();

        await peerConnection.setLocalDescription(offer);

        console.log("📤 Sending offer");

        socket.emit("offer", {
          roomId,
          offer,
        });
      } catch (error) {
        console.error("Offer error:", error);
      }
    };

    /* =========================
       RECEIVE OFFER
    ========================= */

    const handleOffer = async ({ offer }) => {
      console.log("📥 Offer received");

      try {
        const peerConnection = createPeerConnection();

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer)
        );

        // Add queued ICE candidates
        for (const candidate of pendingIceCandidatesRef.current) {
          try {
            await peerConnection.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          } catch (error) {
            console.error("Queued ICE error:", error);
          }
        }

        pendingIceCandidatesRef.current = [];

        const answer = await peerConnection.createAnswer();

        await peerConnection.setLocalDescription(answer);

        console.log("📤 Sending answer");

        socket.emit("answer", {
          roomId,
          answer,
        });
      } catch (error) {
        console.error("Answer error:", error);
      }
    };

    /* =========================
       RECEIVE ANSWER
    ========================= */

    const handleAnswer = async ({ answer }) => {
      console.log("📥 Answer received");

      try {
        const peerConnection = peerConnectionRef.current;

        if (!peerConnection) {
          console.warn("Peer connection not found");
          return;
        }

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(answer)
        );

        // Add queued ICE candidates
        for (const candidate of pendingIceCandidatesRef.current) {
          try {
            await peerConnection.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          } catch (error) {
            console.error("Queued ICE error:", error);
          }
        }

        pendingIceCandidatesRef.current = [];
      } catch (error) {
        console.error("Remote answer error:", error);
      }
    };

    /* =========================
       RECEIVE ICE CANDIDATE
    ========================= */

    const handleIceCandidate = async ({ candidate }) => {
      if (!candidate) return;

      console.log("🧊 ICE candidate received");

      try {
        const peerConnection = peerConnectionRef.current;

        if (!peerConnection) {
          pendingIceCandidatesRef.current.push(candidate);
          return;
        }

        if (peerConnection.remoteDescription) {
          await peerConnection.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        } else {
          pendingIceCandidatesRef.current.push(candidate);
        }
      } catch (error) {
        console.error("ICE candidate error:", error);
      }
    };

    /* =========================
       USER LEFT
    ========================= */

    const handleUserLeft = () => {
      console.log("👋 Other user left");

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }

      setConnected(false);

      pendingIceCandidatesRef.current = [];
    };

    /* =========================
       SOCKET EVENTS
    ========================= */

    socket.on("user-joined", handleUserJoined);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("user-left", handleUserLeft);

    /* =========================
       START
    ========================= */

    startMedia();

    /* =========================
       CLEANUP
    ========================= */

    return () => {
      mounted = false;

      socket.off("user-joined", handleUserJoined);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
      socket.off("user-left", handleUserLeft);

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });

        localStreamRef.current = null;
      }

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      pendingIceCandidatesRef.current = [];

      if (socket.connected) {
        socket.emit("leave-room", {
          roomId,
        });

        socket.disconnect();
      }
    };
  }, [roomId]);

  /* =========================
     MICROPHONE
  ========================= */

  const toggleMic = () => {
    if (!localStreamRef.current) return;

    const audioTrack = localStreamRef.current.getAudioTracks()[0];

    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;

    setMicOn(audioTrack.enabled);
  };

  /* =========================
     CAMERA
  ========================= */

  const toggleCamera = () => {
    if (!localStreamRef.current) return;

    const videoTrack = localStreamRef.current.getVideoTracks()[0];

    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;

    setCameraOn(videoTrack.enabled);
  };

  /* =========================
     END CALL
  ========================= */

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      localStreamRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    pendingIceCandidatesRef.current = [];

    if (socket.connected) {
      socket.emit("leave-room", {
        roomId,
      });

      socket.disconnect();
    }

    setConnected(false);

    if (onEndCall) {
      onEndCall();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* =========================
            HEADER
        ========================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>
              BhashaSetu Interview
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: connected ? "#22c55e" : "#facc15",
              }}
            >
              {connected
                ? "● Connected"
                : "● Waiting for interviewer..."}
            </p>
          </div>

          <div>
            <strong>Room:</strong> {roomId}
          </div>
        </div>

        {/* =========================
            VIDEOS
        ========================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {/* LOCAL VIDEO */}

          <div
            style={{
              position: "relative",
              background: "#020617",
              borderRadius: "16px",
              overflow: "hidden",
              minHeight: "400px",
            }}
          >
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                minHeight: "400px",
                objectFit: "cover",
                background: "#020617",
              }}
            />

            <div
              style={{
                position: "absolute",
                bottom: "15px",
                left: "15px",
                background: "rgba(0,0,0,0.6)",
                padding: "8px 12px",
                borderRadius: "8px",
              }}
            >
              You
            </div>
          </div>

          {/* REMOTE VIDEO */}

          <div
            style={{
              position: "relative",
              background: "#020617",
              borderRadius: "16px",
              overflow: "hidden",
              minHeight: "400px",
            }}
          >
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{
                width: "100%",
                height: "100%",
                minHeight: "400px",
                objectFit: "cover",
                background: "#020617",
              }}
            />

            {!connected && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#94a3b8",
                }}
              >
                Waiting for interviewer...
              </div>
            )}

            <div
              style={{
                position: "absolute",
                bottom: "15px",
                left: "15px",
                background: "rgba(0,0,0,0.6)",
                padding: "8px 12px",
                borderRadius: "8px",
              }}
            >
              Interviewer
            </div>
          </div>
        </div>

        {/* =========================
            CONTROLS
        ========================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            marginTop: "25px",
          }}
        >
          <button
            type="button"
            onClick={toggleMic}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            {micOn ? "🎤 Mic On" : "🔇 Mic Off"}
          </button>

          <button
            type="button"
            onClick={toggleCamera}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            {cameraOn
              ? "📹 Camera On"
              : "📷 Camera Off"}
          </button>

          <button
            type="button"
            onClick={endCall}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              background: "#dc2626",
              color: "white",
            }}
          >
            🔴 End Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
