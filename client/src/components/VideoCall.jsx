import React, { useEffect, useRef, useState } from "react";
import socket from "../socket";

const VideoCall = ({ roomId, onEndCall }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    let mounted = true;

    const configuration = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };

    const createPeerConnection = () => {
      if (peerConnectionRef.current) {
        return peerConnectionRef.current;
      }

      const peerConnection = new RTCPeerConnection(configuration);

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            roomId,
            candidate: event.candidate,
          });
        }
      };

      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }

        setConnected(true);
      };

      peerConnection.onconnectionstatechange = () => {
        const state = peerConnection.connectionState;

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

      peerConnectionRef.current = peerConnection;

      return peerConnection;
    };

    const startMedia = async () => {
      try {
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

        socket.connect();

        socket.emit("join-room", {
          roomId,
        });
      } catch (error) {
        console.error("Camera/Microphone error:", error);
        alert(
          "Camera aur microphone permission allow karo, phir page reload karo."
        );
      }
    };

    const handleUserJoined = async () => {
      try {
        const peerConnection = createPeerConnection();

        const offer = await peerConnection.createOffer();

        await peerConnection.setLocalDescription(offer);

        socket.emit("offer", {
          roomId,
          offer,
        });
      } catch (error) {
        console.error("Offer error:", error);
      }
    };

    const handleOffer = async ({ offer }) => {
      try {
        const peerConnection = createPeerConnection();

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer)
        );

        const answer = await peerConnection.createAnswer();

        await peerConnection.setLocalDescription(answer);

        socket.emit("answer", {
          roomId,
          answer,
        });
      } catch (error) {
        console.error("Answer error:", error);
      }
    };

    const handleAnswer = async ({ answer }) => {
      try {
        const peerConnection = peerConnectionRef.current;

        if (!peerConnection) return;

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      } catch (error) {
        console.error("Remote answer error:", error);
      }
    };

    const handleIceCandidate = async ({ candidate }) => {
      try {
        const peerConnection = peerConnectionRef.current;

        if (!peerConnection || !candidate) return;

        await peerConnection.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } catch (error) {
        console.error("ICE candidate error:", error);
      }
    };

    const handleUserLeft = () => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }

      setConnected(false);
    };

    socket.on("user-joined", handleUserJoined);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("user-left", handleUserLeft);

    startMedia();

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
      }

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }

      socket.emit("leave-room", {
        roomId,
      });

      socket.disconnect();
    };
  }, [roomId]);

  const toggleMic = () => {
    if (!localStreamRef.current) return;

    const audioTrack = localStreamRef.current.getAudioTracks()[0];

    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;

    setMicOn(audioTrack.enabled);
  };

  const toggleCamera = () => {
    if (!localStreamRef.current) return;

    const videoTrack = localStreamRef.current.getVideoTracks()[0];

    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;

    setCameraOn(videoTrack.enabled);
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    socket.emit("leave-room", {
      roomId,
    });

    socket.disconnect();

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>BhashaSetu Interview</h2>

            <p
              style={{
                margin: "6px 0 0",
                color: connected ? "#22c55e" : "#facc15",
              }}
            >
              {connected ? "● Connected" : "● Waiting for interviewer..."}
            </p>
          </div>

          <div>
            <strong>Room:</strong> {roomId}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
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

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            marginTop: "25px",
          }}
        >
          <button
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
            onClick={toggleCamera}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            {cameraOn ? "📹 Camera On" : "📷 Camera Off"}
          </button>

          <button
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