import React, { useEffect, useRef, useState } from "react";
import socket from "../socket";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const VoiceCall = ({ roomId, onEndCall }) => {
  // =====================================================
  // WEBRTC REFS
  // =====================================================

  const remoteAudioRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const pendingIceCandidatesRef = useRef([]);

  // =====================================================
  // SPEECH RECOGNITION REFS
  // =====================================================

  const recognitionRef = useRef(null);
  const recognitionRunningRef = useRef(false);
  const manualStopRecognitionRef = useRef(false);
  const callActiveRef = useRef(true);

  // =====================================================
  // CALL STATES
  // =====================================================

  const [micOn, setMicOn] = useState(true);
  const [connected, setConnected] = useState(false);

  // =====================================================
  // LANGUAGE STATES
  // =====================================================

  const [fromLanguage, setFromLanguage] = useState("Hindi");
  const [toLanguage, setToLanguage] = useState("English");

  // =====================================================
  // TRANSLATION STATES
  // =====================================================

  const [recognizing, setRecognizing] = useState(false);
  const [translating, setTranslating] = useState(false);

  const [originalText, setOriginalText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const [translationStatus, setTranslationStatus] =
    useState("Ready");

  // =====================================================
  // LANGUAGE HELPER
  // =====================================================

  const getSpeechLanguage = (language) => {
    return language === "Hindi" ? "hi-IN" : "en-US";
  };

  // =====================================================
  // SWAP LANGUAGES
  // =====================================================

  const swapLanguages = () => {
    setFromLanguage((currentFrom) => {
      setToLanguage(currentFrom);
      return toLanguage;
    });

    setOriginalText("");
    setTranslatedText("");
    setTranslationStatus("Languages swapped");

    if (recognitionRef.current) {
      manualStopRecognitionRef.current = true;

      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log("Recognition stop:", error);
      }

      recognitionRef.current = null;
      recognitionRunningRef.current = false;
      setRecognizing(false);
    }
  };

  // =====================================================
  // WEBRTC VOICE CALL
  // =====================================================

  useEffect(() => {
    if (!roomId) return;

    let mounted = true;
    let mediaStarted = false;

    callActiveRef.current = true;
    manualStopRecognitionRef.current = false;

    const configuration = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };

    // ===================================================
    // CREATE PEER CONNECTION
    // ===================================================

    const createPeerConnection = () => {
      if (peerConnectionRef.current) {
        return peerConnectionRef.current;
      }

      const peerConnection = new RTCPeerConnection(
        configuration
      );

      // -------------------------------------------------
      // ICE CANDIDATE
      // -------------------------------------------------

      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket.connected) {
          socket.emit("ice-candidate", {
            roomId,
            candidate: event.candidate,
          });
        }
      };

      // -------------------------------------------------
      // REMOTE AUDIO
      // -------------------------------------------------

      peerConnection.ontrack = (event) => {
        console.log("🔊 Remote voice received");

        if (
          remoteAudioRef.current &&
          event.streams &&
          event.streams[0]
        ) {
          remoteAudioRef.current.srcObject =
            event.streams[0];

          remoteAudioRef.current
            .play()
            .catch((error) => {
              console.log(
                "Audio autoplay blocked:",
                error
              );
            });
        }
      };

      // -------------------------------------------------
      // CONNECTION STATE
      // -------------------------------------------------

      peerConnection.onconnectionstatechange = () => {
        const state =
          peerConnection.connectionState;

        console.log(
          "🎧 Voice connection state:",
          state
        );

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

      // -------------------------------------------------
      // ICE STATE
      // -------------------------------------------------

      peerConnection.oniceconnectionstatechange =
        () => {
          console.log(
            "🧊 ICE connection state:",
            peerConnection.iceConnectionState
          );
        };

      peerConnectionRef.current =
        peerConnection;

      return peerConnection;
    };

    // ===================================================
    // START MICROPHONE
    // ===================================================

    const startMedia = async () => {
      if (mediaStarted) return;

      try {
        mediaStarted = true;

        const stream =
          await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
          });

        if (!mounted) {
          stream
            .getTracks()
            .forEach((track) => track.stop());

          return;
        }

        localStreamRef.current = stream;

        const peerConnection =
          createPeerConnection();

        stream
          .getAudioTracks()
          .forEach((track) => {
            peerConnection.addTrack(
              track,
              stream
            );
          });

        // ------------------------------------------------
        // JOIN ROOM
        // ------------------------------------------------

        const joinRoom = () => {
          if (!socket.connected) return;

          console.log(
            "🚪 Joining voice room:",
            roomId
          );

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
        console.error(
          "Microphone error:",
          error
        );

        mediaStarted = false;

        alert(
          "Microphone permission allow karo, phir page reload karo."
        );
      }
    };

    // ===================================================
    // USER JOINED
    // FIRST USER CREATES OFFER
    // ===================================================

    const handleUserJoined = async ({
      socketId,
    }) => {
      console.log(
        "👤 User joined:",
        socketId
      );

      try {
        const peerConnection =
          createPeerConnection();

        const offer =
          await peerConnection.createOffer();

        await peerConnection.setLocalDescription(
          offer
        );

        console.log(
          "📤 Sending voice offer"
        );

        socket.emit("offer", {
          roomId,
          offer,
        });
      } catch (error) {
        console.error(
          "Offer error:",
          error
        );
      }
    };

    // ===================================================
    // RECEIVE OFFER
    // ===================================================

    const handleOffer = async ({ offer }) => {
      console.log(
        "📥 Voice offer received"
      );

      try {
        const peerConnection =
          createPeerConnection();

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer)
        );

        // -----------------------------------------------
        // ADD QUEUED ICE CANDIDATES
        // -----------------------------------------------

        for (
          const candidate of
          pendingIceCandidatesRef.current
        ) {
          try {
            await peerConnection.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          } catch (error) {
            console.error(
              "Queued ICE error:",
              error
            );
          }
        }

        pendingIceCandidatesRef.current = [];

        // -----------------------------------------------
        // CREATE ANSWER
        // -----------------------------------------------

        const answer =
          await peerConnection.createAnswer();

        await peerConnection.setLocalDescription(
          answer
        );

        console.log(
          "📤 Sending voice answer"
        );

        socket.emit("answer", {
          roomId,
          answer,
        });
      } catch (error) {
        console.error(
          "Answer error:",
          error
        );
      }
    };

    // ===================================================
    // RECEIVE ANSWER
    // ===================================================

    const handleAnswer = async ({ answer }) => {
      console.log(
        "📥 Voice answer received"
      );

      try {
        const peerConnection =
          peerConnectionRef.current;

        if (!peerConnection) {
          console.warn(
            "Peer connection not found"
          );

          return;
        }

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(answer)
        );

        // -----------------------------------------------
        // ADD QUEUED ICE CANDIDATES
        // -----------------------------------------------

        for (
          const candidate of
          pendingIceCandidatesRef.current
        ) {
          try {
            await peerConnection.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          } catch (error) {
            console.error(
              "Queued ICE error:",
              error
            );
          }
        }

        pendingIceCandidatesRef.current = [];
      } catch (error) {
        console.error(
          "Answer handling error:",
          error
        );
      }
    };

    // ===================================================
    // RECEIVE ICE CANDIDATE
    // ===================================================

    const handleIceCandidate = async ({
      candidate,
    }) => {
      if (!candidate) return;

      console.log(
        "🧊 Voice ICE candidate received"
      );

      try {
        const peerConnection =
          peerConnectionRef.current;

        if (!peerConnection) {
          pendingIceCandidatesRef.current.push(
            candidate
          );

          return;
        }

        if (
          peerConnection.remoteDescription
        ) {
          await peerConnection.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        } else {
          pendingIceCandidatesRef.current.push(
            candidate
          );
        }
      } catch (error) {
        console.error(
          "ICE candidate error:",
          error
        );
      }
    };

    // ===================================================
    // USER LEFT
    // ===================================================

    const handleUserLeft = () => {
      console.log(
        "👋 Other user left"
      );

      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject =
          null;
      }

      setConnected(false);

      pendingIceCandidatesRef.current = [];
    };

    // ===================================================
    // SOCKET EVENTS
    // ===================================================

    socket.on(
      "user-joined",
      handleUserJoined
    );

    socket.on(
      "offer",
      handleOffer
    );

    socket.on(
      "answer",
      handleAnswer
    );

    socket.on(
      "ice-candidate",
      handleIceCandidate
    );

    socket.on(
      "user-left",
      handleUserLeft
    );

    // ===================================================
    // START
    // ===================================================

    startMedia();

    // ===================================================
    // CLEANUP
    // ===================================================

    return () => {
      mounted = false;

      callActiveRef.current = false;

      manualStopRecognitionRef.current =
        true;

      // -----------------------------------------------
      // STOP SPEECH RECOGNITION
      // -----------------------------------------------

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log(
            "Recognition cleanup:",
            error
          );
        }

        recognitionRef.current = null;
      }

      recognitionRunningRef.current =
        false;

      // -----------------------------------------------
      // STOP SPEECH SYNTHESIS
      // -----------------------------------------------

      if (
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
      }

      // -----------------------------------------------
      // REMOVE SOCKET EVENTS
      // -----------------------------------------------

      socket.off(
        "user-joined",
        handleUserJoined
      );

      socket.off(
        "offer",
        handleOffer
      );

      socket.off(
        "answer",
        handleAnswer
      );

      socket.off(
        "ice-candidate",
        handleIceCandidate
      );

      socket.off(
        "user-left",
        handleUserLeft
      );

      // -----------------------------------------------
      // STOP MICROPHONE
      // -----------------------------------------------

      if (localStreamRef.current) {
        localStreamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });

        localStreamRef.current = null;
      }

      // -----------------------------------------------
      // CLOSE PEER CONNECTION
      // -----------------------------------------------

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();

        peerConnectionRef.current = null;
      }

      pendingIceCandidatesRef.current = [];

      // -----------------------------------------------
      // LEAVE SOCKET ROOM
      // -----------------------------------------------

      if (socket.connected) {
        socket.emit("leave-room", {
          roomId,
        });

        socket.disconnect();
      }
    };
  }, [roomId]);

  // =====================================================
  // MICROPHONE ON / OFF
  // =====================================================

  const toggleMic = () => {
    if (!localStreamRef.current) return;

    const audioTrack =
      localStreamRef.current.getAudioTracks()[0];

    if (!audioTrack) return;

    audioTrack.enabled =
      !audioTrack.enabled;

    setMicOn(audioTrack.enabled);
  };

  // =====================================================
  // TEXT TO SPEECH
  // =====================================================

  const speakText = (text, language) => {
    if (
      !text ||
      !text.trim() ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    utterance.lang =
      getSpeechLanguage(language);

    utterance.rate = 0.95;
    utterance.pitch = 1;

    window.speechSynthesis.speak(
      utterance
    );
  };

  // =====================================================
  // TRANSLATION API
  // =====================================================

  const translateText = async (text) => {
    if (!text || !text.trim()) return;

    setTranslating(true);

    setTranslationStatus(
      "Translating..."
    );

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/translation`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            text: text.trim(),

            sourceLanguage:
              fromLanguage,

            targetLanguage:
              toLanguage,

            fromLanguage,

            toLanguage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Translation API error: ${response.status}`
        );
      }

      const data =
        await response.json();

      const result =
        data.translation ||
        data.translatedText ||
        data.translated ||
        data.result ||
        data.text ||
        "";

      if (!result) {
        throw new Error(
          "Translation response empty"
        );
      }

      setTranslatedText(result);

      setTranslationStatus(
        "Translation complete"
      );

      // -----------------------------------------------
      // PLAY TRANSLATED VOICE
      // -----------------------------------------------

      speakText(
        result,
        toLanguage
      );
    } catch (error) {
      console.error(
        "Translation error:",
        error
      );

      setTranslationStatus(
        "Translation failed"
      );

      setTranslatedText(
        "Translation service unavailable."
      );
    } finally {
      setTranslating(false);
    }
  };

  // =====================================================
  // START CONTINUOUS VOICE TRANSLATION
  // =====================================================

  const startVoiceTranslation = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech Recognition supported nahi hai. Chrome ya Edge use karo."
      );

      return;
    }

    if (
      recognitionRunningRef.current
    ) {
      return;
    }

    manualStopRecognitionRef.current =
      false;

    callActiveRef.current = true;

    const recognition =
      new SpeechRecognition();

    recognition.lang =
      getSpeechLanguage(fromLanguage);

    // IMPORTANT:
    // Browser kabhi-kabhi continuous recognition
    // automatically stop karta hai.
    // onend mein hum restart karenge.
    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.maxAlternatives = 1;

    recognitionRef.current =
      recognition;

    recognitionRunningRef.current =
      true;

    setRecognizing(true);

    setOriginalText("");
    setTranslatedText("");

    setTranslationStatus(
      `Listening continuously in ${fromLanguage}...`
    );

    // =================================================
    // ON START
    // =================================================

    recognition.onstart = () => {
      console.log(
        "🎤 Continuous speech recognition started"
      );

      recognitionRunningRef.current =
        true;

      setRecognizing(true);

      setTranslationStatus(
        `Listening in ${fromLanguage}...`
      );
    };

    // =================================================
    // ON RESULT
    // =================================================

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0]
            .transcript;

        if (
          event.results[i].isFinal
        ) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }

      // -----------------------------------------------
      // SHOW LIVE TEXT
      // -----------------------------------------------

      const displayText =
        finalText || interimText;

      if (displayText.trim()) {
        setOriginalText(
          displayText
        );
      }

      // -----------------------------------------------
      // TRANSLATE FINAL SPEECH
      // -----------------------------------------------

      if (finalText.trim()) {
        console.log(
          "📝 Final speech:",
          finalText.trim()
        );

        translateText(
          finalText.trim()
        );
      }
    };

    // =================================================
    // ON ERROR
    // =================================================

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      if (
        event.error ===
        "not-allowed"
      ) {
        recognitionRunningRef.current =
          false;

        setRecognizing(false);

        setTranslationStatus(
          "Microphone permission denied"
        );

        return;
      }

      if (
        event.error ===
        "no-speech"
      ) {
        setTranslationStatus(
          "Listening... waiting for speech"
        );

        return;
      }

      if (
        event.error ===
        "aborted"
      ) {
        return;
      }

      setTranslationStatus(
        `Speech recognition error: ${event.error}`
      );
    };

    // =================================================
    // ON END
    // =================================================

    recognition.onend = () => {
      console.log(
        "🎤 Speech recognition ended"
      );

      recognitionRunningRef.current =
        false;

      // -----------------------------------------------
      // AUTO RESTART
      // -----------------------------------------------

      if (
        callActiveRef.current &&
        !manualStopRecognitionRef.current
      ) {
        console.log(
          "🔄 Restarting speech recognition..."
        );

        setTranslationStatus(
          `Restarting listening in ${fromLanguage}...`
        );

        setTimeout(() => {
          if (
            callActiveRef.current &&
            !manualStopRecognitionRef.current
          ) {
            try {
              recognition.start();

              recognitionRunningRef.current =
                true;

              setRecognizing(true);

              setTranslationStatus(
                `Listening continuously in ${fromLanguage}...`
              );

              console.log(
                "✅ Speech recognition restarted"
              );
            } catch (error) {
              console.log(
                "Recognition restart error:",
                error
              );

              recognitionRunningRef.current =
                false;

              setTimeout(() => {
                if (
                  callActiveRef.current &&
                  !manualStopRecognitionRef.current &&
                  !recognitionRunningRef.current
                ) {
                  try {
                    recognition.start();

                    recognitionRunningRef.current =
                      true;

                    setRecognizing(true);

                    setTranslationStatus(
                      `Listening continuously in ${fromLanguage}...`
                    );
                  } catch (retryError) {
                    console.error(
                      "Recognition retry failed:",
                      retryError
                    );
                  }
                }
              }, 500);
            }
          }
        }, 300);
      } else {
        setRecognizing(false);

        console.log(
          "🛑 Speech recognition stopped"
        );
      }
    };

    // =================================================
    // START RECOGNITION
    // =================================================

    try {
      recognition.start();

      console.log(
        "🚀 Starting voice translation"
      );
    } catch (error) {
      console.error(
        "Recognition start error:",
        error
      );

      recognitionRunningRef.current =
        false;

      setRecognizing(false);

      setTranslationStatus(
        "Unable to start speech recognition"
      );
    }
  };

  // =====================================================
  // STOP VOICE TRANSLATION
  // =====================================================

  const stopVoiceTranslation = () => {
    // IMPORTANT:
    // Pehle manual stop true karo,
    // warna onend recognition ko restart karega.

    manualStopRecognitionRef.current =
      true;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log(
          "Recognition already stopped:",
          error
        );
      }

      recognitionRef.current = null;
    }

    recognitionRunningRef.current =
      false;

    setRecognizing(false);

    setTranslationStatus(
      "Voice translation stopped"
    );
  };

  // =====================================================
  // CLEAR TRANSLATION
  // =====================================================

  const clearTranslation = () => {
    setOriginalText("");
    setTranslatedText("");

    setTranslationStatus("Ready");

    if (
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }
  };

  // =====================================================
  // END CALL
  // =====================================================

  const endCall = () => {
    callActiveRef.current = false;

    manualStopRecognitionRef.current =
      true;

    stopVoiceTranslation();

    if (
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }

    // -----------------------------------------------
    // STOP MICROPHONE
    // -----------------------------------------------

    if (localStreamRef.current) {
      localStreamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      localStreamRef.current = null;
    }

    // -----------------------------------------------
    // CLOSE PEER CONNECTION
    // -----------------------------------------------

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();

      peerConnectionRef.current = null;
    }

    pendingIceCandidatesRef.current = [];

    // -----------------------------------------------
    // LEAVE ROOM
    // -----------------------------------------------

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

  // =====================================================
  // UI
  // =====================================================

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
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
              }}
            >
              🎧 BhashaSetu Voice Call
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: connected
                  ? "#22c55e"
                  : "#facc15",
              }}
            >
              {connected
                ? "● Connected"
                : "● Waiting for user..."}
            </p>
          </div>

          <div
            style={{
              background: "#1e293b",
              padding: "10px 15px",
              borderRadius: "10px",
            }}
          >
            <strong>Room:</strong>{" "}
            {roomId}
          </div>
        </div>

        {/* =================================================
            MAIN
        ================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 390px",
            gap: "25px",
            alignItems: "start",
          }}
        >
          {/* =================================================
              VOICE CALL
          ================================================= */}

          <div
            style={{
              background: "#111827",
              borderRadius: "20px",
              padding: "35px",
              textAlign: "center",
              minHeight: "550px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                background: connected
                  ? "#2563eb"
                  : "#334155",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "65px",
                marginBottom: "25px",
                boxShadow: connected
                  ? "0 0 0 15px rgba(37,99,235,0.12)"
                  : "none",
              }}
            >
              🎙️
            </div>

            <h2
              style={{
                margin: "0 0 8px",
              }}
            >
              Interviewer
            </h2>

            <p
              style={{
                color: "#94a3b8",
                margin: "0 0 30px",
              }}
            >
              {connected
                ? "Voice connected"
                : "Waiting for connection..."}
            </p>

            <div
              style={{
                background: "#1e293b",
                padding: "12px 22px",
                borderRadius: "10px",
                marginBottom: "30px",
              }}
            >
              🎤 {fromLanguage}

              <span
                style={{
                  margin: "0 10px",
                }}
              >
                →
              </span>

              🔊 {toLanguage}
            </div>

            {/* CONTROLS */}

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <button
                type="button"
                onClick={toggleMic}
                style={{
                  padding:
                    "13px 22px",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  background: micOn
                    ? "#2563eb"
                    : "#991b1b",
                  color: "white",
                  fontWeight: "700",
                }}
              >
                {micOn
                  ? "🎤 Mic On"
                  : "🔇 Mic Off"}
              </button>

              <button
                type="button"
                onClick={endCall}
                style={{
                  padding:
                    "13px 22px",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  background: "#dc2626",
                  color: "white",
                  fontWeight: "700",
                }}
              >
                🔴 End Call
              </button>
            </div>

            {/* REMOTE AUDIO */}

            <audio
              ref={remoteAudioRef}
              autoPlay
              playsInline
            />
          </div>

          {/* =================================================
              TRANSLATION PANEL
          ================================================= */}

          <div
            style={{
              background: "white",
              color: "#0f172a",
              borderRadius: "18px",
              padding: "20px",
              boxShadow:
                "0 15px 40px rgba(0,0,0,0.25)",
            }}
          >
            <h2
              style={{
                margin: "0 0 5px",
              }}
            >
              🌐 Live Translation
            </h2>

            <p
              style={{
                margin: "0 0 20px",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Continuous Voice + Text Translation
            </p>

            {/* =================================================
                LANGUAGE SELECTORS
            ================================================= */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 40px 1fr",
                gap: "8px",
                alignItems: "end",
                marginBottom: "15px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: "700",
                  }}
                >
                  YOU SPEAK
                </label>

                <select
                  value={fromLanguage}
                  onChange={(e) => {
                    const newLanguage =
                      e.target.value;

                    if (
                      recognitionRef.current
                    ) {
                      stopVoiceTranslation();
                    }

                    setFromLanguage(
                      newLanguage
                    );

                    setOriginalText("");
                    setTranslatedText("");

                    setTranslationStatus(
                      "Language changed"
                    );
                  }}
                  style={{
                    width: "100%",
                    marginTop: "6px",
                    padding: "10px",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius: "8px",
                    background: "#f8fafc",
                    fontWeight: "600",
                  }}
                >
                  <option value="Hindi">
                    🇮🇳 Hindi
                  </option>

                  <option value="English">
                    🇬🇧 English
                  </option>
                </select>
              </div>

              <button
                type="button"
                onClick={swapLanguages}
                title="Swap languages"
                style={{
                  height: "40px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "20px",
                  background: "#e2e8f0",
                }}
              >
                ⇄
              </button>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: "700",
                  }}
                >
                  THEY SPEAK
                </label>

                <select
                  value={toLanguage}
                  onChange={(e) => {
                    setToLanguage(
                      e.target.value
                    );

                    setOriginalText("");
                    setTranslatedText("");

                    setTranslationStatus(
                      "Language changed"
                    );
                  }}
                  style={{
                    width: "100%",
                    marginTop: "6px",
                    padding: "10px",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius: "8px",
                    background: "#f8fafc",
                    fontWeight: "600",
                  }}
                >
                  <option value="English">
                    🇬🇧 English
                  </option>

                  <option value="Hindi">
                    🇮🇳 Hindi
                  </option>
                </select>
              </div>
            </div>

            {/* =================================================
                DIRECTION
            ================================================= */}

            <div
              style={{
                textAlign: "center",
                padding: "9px",
                borderRadius: "8px",
                background: "#eff6ff",
                color: "#2563eb",
                fontWeight: "700",
                fontSize: "13px",
                marginBottom: "15px",
              }}
            >
              {fromLanguage} →{" "}
              {toLanguage}
            </div>

            {/* =================================================
                START / STOP
            ================================================= */}

            <button
              type="button"
              onClick={
                recognizing
                  ? stopVoiceTranslation
                  : startVoiceTranslation
              }
              style={{
                width: "100%",
                padding: "13px",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                background: recognizing
                  ? "#dc2626"
                  : "#2563eb",
                color: "white",
                fontWeight: "700",
                marginBottom: "12px",
              }}
            >
              {recognizing
                ? "⏹ Stop Listening"
                : "🎤 Start Voice Translation"}
            </button>

            {/* =================================================
                STATUS
            ================================================= */}

            <div
              style={{
                textAlign: "center",
                fontSize: "12px",
                color: translating
                  ? "#2563eb"
                  : "#64748b",
                marginBottom: "12px",
                fontWeight: "600",
              }}
            >
              {recognizing
                ? `🎙 Listening continuously in ${fromLanguage}...`
                : translating
                ? "🧠 Translating..."
                : `● ${translationStatus}`}
            </div>

            {/* =================================================
                ORIGINAL TEXT
            ================================================= */}

            <div
              style={{
                background: "#f8fafc",
                border:
                  "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "13px",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                }}
              >
                <strong
                  style={{
                    fontSize: "13px",
                  }}
                >
                  🎤 Your Speech
                </strong>

                <span
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                  }}
                >
                  {fromLanguage}
                </span>
              </div>

              <p
                style={{
                  minHeight: "55px",
                  margin: "8px 0 0",
                  color: originalText
                    ? "#0f172a"
                    : "#94a3b8",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                {originalText ||
                  "Your speech will appear here..."}
              </p>
            </div>

            {/* =================================================
                TRANSLATED TEXT
            ================================================= */}

            <div
              style={{
                background: "#eff6ff",
                border:
                  "1px solid #bfdbfe",
                borderRadius: "10px",
                padding: "13px",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                }}
              >
                <strong
                  style={{
                    fontSize: "13px",
                  }}
                >
                  🌐 Translated Text
                </strong>

                <span
                  style={{
                    fontSize: "11px",
                    color: "#2563eb",
                  }}
                >
                  {toLanguage}
                </span>
              </div>

              <p
                style={{
                  minHeight: "55px",
                  margin: "8px 0 0",
                  color: translatedText
                    ? "#0f172a"
                    : "#94a3b8",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                {translatedText ||
                  "Translation will appear here..."}
              </p>
            </div>

            {/* =================================================
                PLAY TRANSLATED VOICE
            ================================================= */}

            <button
              type="button"
              disabled={!translatedText}
              onClick={() =>
                speakText(
                  translatedText,
                  toLanguage
                )
              }
              style={{
                width: "100%",
                padding: "11px",
                border: "none",
                borderRadius: "9px",
                cursor: translatedText
                  ? "pointer"
                  : "not-allowed",
                background: translatedText
                  ? "#16a34a"
                  : "#cbd5e1",
                color: "white",
                fontWeight: "700",
                marginBottom: "8px",
              }}
            >
              🔊 Play Translated Voice
            </button>

            {/* =================================================
                CLEAR
            ================================================= */}

            <button
              type="button"
              onClick={
                clearTranslation
              }
              style={{
                width: "100%",
                padding: "10px",
                border:
                  "1px solid #cbd5e1",
                borderRadius: "9px",
                cursor: "pointer",
                background: "white",
                color: "#475569",
                fontWeight: "600",
              }}
            >
              🗑 Clear
            </button>

            {/* =================================================
                INFO
            ================================================= */}

            <div
              style={{
                marginTop: "15px",
                padding: "11px",
                background: "#f8fafc",
                borderRadius: "9px",
                color: "#64748b",
                fontSize: "11px",
                lineHeight: "1.6",
              }}
            >
              <strong>
                How it works:
              </strong>
              <br />
              1. Select your language.
              <br />
              2. Click Start Voice Translation.
              <br />
              3. Speak naturally.
              <br />
              4. Speech is continuously recognized.
              <br />
              5. Final speech is translated.
              <br />
              6. Translated voice is played.
              <br />
              7. Recognition automatically restarts.
              <br />
              8. Stop Listening manually or End Call.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCall;