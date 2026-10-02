import React, { useEffect, useRef, useState } from "react";
import socket from "../socket";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const VideoCall = ({ roomId, onEndCall }) => {
  /* =====================================================
     WEBRTC REFS
  ===================================================== */

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  const pendingIceCandidatesRef = useRef([]);

  /* =====================================================
     TRANSLATION REFS
  ===================================================== */

  const recognitionRef = useRef(null);

  // Recognition currently running
  const recognitionRunningRef = useRef(false);

  // User manually stopped recognition
  const manualStopRecognitionRef = useRef(false);

  // Component/call active
  const callActiveRef = useRef(true);

  // Translation request status
  const translatingRef = useRef(false);

  // Pending recognition restart timer
  const recognitionRestartTimerRef = useRef(null);

  // Used to invalidate old recognition instances
  const recognitionSessionRef = useRef(0);

  // Number of temporary recognition errors
  const recognitionErrorCountRef = useRef(0);

  /* =====================================================
     CALL STATES
  ===================================================== */

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [connected, setConnected] = useState(false);

  /* =====================================================
     LANGUAGE STATES
  ===================================================== */

  const [fromLanguage, setFromLanguage] = useState("Hindi");
  const [toLanguage, setToLanguage] = useState("English");

  /* =====================================================
     TRANSLATION STATES
  ===================================================== */

  const [recognizing, setRecognizing] = useState(false);
  const [translating, setTranslating] = useState(false);

  const [originalText, setOriginalText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const [translationStatus, setTranslationStatus] =
    useState("Ready");

  /* =====================================================
     LANGUAGE HELPERS
  ===================================================== */

  const getSpeechLanguage = (language) => {
    if (language === "Hindi") {
      return "hi-IN";
    }

    return "en-US";
  };

  /* =====================================================
     SWAP LANGUAGES
  ===================================================== */

  const swapLanguages = () => {
    // Stop recognition before changing language
    if (recognitionRunningRef.current) {
      stopVoiceTranslation();
    }

    setFromLanguage(toLanguage);
    setToLanguage(fromLanguage);

    setOriginalText("");
    setTranslatedText("");
    setTranslationStatus("Languages swapped");
  };

  /* =====================================================
     CREATE PEER CONNECTION
  ===================================================== */

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

    /* =====================================================
       CREATE PEER CONNECTION
    ===================================================== */

    const createPeerConnection = () => {
      if (peerConnectionRef.current) {
        return peerConnectionRef.current;
      }

      const peerConnection =
        new RTCPeerConnection(configuration);

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
          remoteVideoRef.current.srcObject =
            event.streams[0];
        }
      };

      peerConnection.onconnectionstatechange = () => {
        const state = peerConnection.connectionState;

        console.log(
          "WebRTC connection state:",
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

      peerConnection.oniceconnectionstatechange =
        () => {
          console.log(
            "ICE connection state:",
            peerConnection.iceConnectionState
          );
        };

      peerConnectionRef.current = peerConnection;

      return peerConnection;
    };

    /* =====================================================
       START CAMERA + MICROPHONE
    ===================================================== */

    const startMedia = async () => {
      if (mediaStarted) return;

      try {
        mediaStarted = true;

        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

        if (!mounted) {
          stream
            .getTracks()
            .forEach((track) => track.stop());

          return;
        }

        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const peerConnection =
          createPeerConnection();

        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });

        /* =================================================
           CONNECT FIRST, THEN JOIN
        ================================================= */

        const joinRoom = () => {
          if (!socket.connected) return;

          console.log(
            "🚪 Joining room:",
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
          "Camera/Microphone error:",
          error
        );

        mediaStarted = false;

        alert(
          "Camera aur microphone permission allow karo, phir page reload karo."
        );
      }
    };

    /* =====================================================
       USER JOINED
       FIRST USER CREATES OFFER
    ===================================================== */

    const handleUserJoined = async ({
      socketId,
    }) => {
      console.log(
        "👤 New user joined:",
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

        console.log("📤 Sending offer");

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

    /* =====================================================
       RECEIVE OFFER
    ===================================================== */

    const handleOffer = async ({ offer }) => {
      console.log("📥 Offer received");

      try {
        const peerConnection =
          createPeerConnection();

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer)
        );

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

        const answer =
          await peerConnection.createAnswer();

        await peerConnection.setLocalDescription(
          answer
        );

        console.log("📤 Sending answer");

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

    /* =====================================================
       RECEIVE ANSWER
    ===================================================== */

    const handleAnswer = async ({ answer }) => {
      console.log("📥 Answer received");

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
          "Remote answer error:",
          error
        );
      }
    };

    /* =====================================================
       RECEIVE ICE CANDIDATE
    ===================================================== */

    const handleIceCandidate = async ({
      candidate,
    }) => {
      if (!candidate) return;

      console.log(
        "🧊 ICE candidate received"
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

        if (peerConnection.remoteDescription) {
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

    /* =====================================================
       USER LEFT
    ===================================================== */

    const handleUserLeft = () => {
      console.log(
        "👋 Other user left"
      );

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }

      setConnected(false);

      pendingIceCandidatesRef.current = [];
    };

    /* =====================================================
       SOCKET EVENTS
    ===================================================== */

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

    /* =====================================================
       START
    ===================================================== */

    startMedia();

    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {
      mounted = false;

      callActiveRef.current = false;

      manualStopRecognitionRef.current = true;

      /*
        Invalidate current recognition session
      */

      recognitionSessionRef.current += 1;

      /*
        Cancel pending recognition restart
      */

      if (recognitionRestartTimerRef.current) {
        clearTimeout(
          recognitionRestartTimerRef.current
        );

        recognitionRestartTimerRef.current = null;
      }

      /*
        STOP SPEECH RECOGNITION
      */

      if (recognitionRef.current) {
        const recognition =
          recognitionRef.current;

        recognitionRef.current = null;

        /*
          Remove callbacks first so onend
          cannot restart recognition.
        */

        recognition.onstart = null;
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;

        try {
          recognition.stop();
        } catch (error) {
          console.log(
            "Recognition stop:",
            error
          );
        }
      }

      recognitionRunningRef.current = false;

      /*
        STOP SPEECH SYNTHESIS
      */

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      /*
        SOCKET CLEANUP
      */

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

      /*
        STOP LOCAL STREAM
      */

      if (localStreamRef.current) {
        localStreamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });

        localStreamRef.current = null;
      }

      /*
        CLOSE PEER CONNECTION
      */

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      pendingIceCandidatesRef.current = [];

      /*
        DISCONNECT SOCKET
      */

      if (socket.connected) {
        socket.emit("leave-room", {
          roomId,
        });

        socket.disconnect();
      }
    };
  }, [roomId]);

  /* =====================================================
     MICROPHONE
  ===================================================== */

  const toggleMic = () => {
    if (!localStreamRef.current) return;

    const audioTrack =
      localStreamRef.current.getAudioTracks()[0];

    if (!audioTrack) return;

    audioTrack.enabled =
      !audioTrack.enabled;

    setMicOn(audioTrack.enabled);
  };

  /* =====================================================
     CAMERA
  ===================================================== */

  const toggleCamera = () => {
    if (!localStreamRef.current) return;

    const videoTrack =
      localStreamRef.current.getVideoTracks()[0];

    if (!videoTrack) return;

    videoTrack.enabled =
      !videoTrack.enabled;

    setCameraOn(videoTrack.enabled);
  };

  /* =====================================================
     TRANSLATE TEXT
  ===================================================== */

  const translateText = async (text) => {
    if (!text.trim()) return;

    setTranslating(true);
    translatingRef.current = true;

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
            sourceLanguage: fromLanguage,
            targetLanguage: toLanguage,
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

      const data = await response.json();

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

      /* ================================================
         TEXT TO SPEECH
      ================================================= */

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();

        const utterance =
          new SpeechSynthesisUtterance(
            result
          );

        utterance.lang =
          getSpeechLanguage(toLanguage);

        utterance.rate = 0.95;
        utterance.pitch = 1;

        window.speechSynthesis.speak(
          utterance
        );
      }
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
      translatingRef.current = false;
    }
  };

  /* =====================================================
     START CONTINUOUS VOICE TRANSLATION
  ===================================================== */

  const startVoiceTranslation = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech Recognition is not supported in this browser. Chrome/Edge use karo."
      );

      return;
    }

    /*
      Already running
    */

    if (recognitionRunningRef.current) {
      return;
    }

    /*
      Cancel previous restart timer
    */

    if (recognitionRestartTimerRef.current) {
      clearTimeout(
        recognitionRestartTimerRef.current
      );

      recognitionRestartTimerRef.current = null;
    }

    /*
      New session
    */

    manualStopRecognitionRef.current = false;
    callActiveRef.current = true;

    recognitionSessionRef.current += 1;

    const sessionId =
      recognitionSessionRef.current;

    recognitionErrorCountRef.current = 0;

    setRecognizing(true);
    setOriginalText("");
    setTranslatedText("");

    setTranslationStatus(
      `Listening continuously in ${fromLanguage}...`
    );

    /* =====================================================
       CREATE NEW RECOGNITION INSTANCE
    ===================================================== */

    const createRecognition = () => {
      /*
        Check if session is still valid
      */

      if (
        sessionId !==
          recognitionSessionRef.current ||
        !callActiveRef.current ||
        manualStopRecognitionRef.current
      ) {
        return null;
      }

      const recognition =
        new SpeechRecognition();

      recognition.lang =
        getSpeechLanguage(fromLanguage);

      /*
        Continuous recognition
      */

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognitionRef.current =
        recognition;

      /* ===================================================
         ON START
      =================================================== */

      recognition.onstart = () => {
        if (
          sessionId !==
            recognitionSessionRef.current ||
          manualStopRecognitionRef.current
        ) {
          return;
        }

        console.log(
          "🎤 Speech recognition started"
        );

        recognitionRunningRef.current =
          true;

        recognitionErrorCountRef.current = 0;

        setRecognizing(true);

        setTranslationStatus(
          `Listening in ${fromLanguage}...`
        );
      };

      /* ===================================================
         ON RESULT
      =================================================== */

      recognition.onresult = (event) => {
        if (
          sessionId !==
            recognitionSessionRef.current ||
          manualStopRecognitionRef.current
        ) {
          return;
        }

        let finalText = "";
        let interimText = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {
          const transcript =
            event.results[i][0]?.transcript ||
            "";

          if (
            event.results[i].isFinal
          ) {
            finalText += transcript;
          } else {
            interimText += transcript;
          }
        }

        /*
          Show live speech
        */

        const displayText =
          finalText || interimText;

        if (displayText.trim()) {
          setOriginalText(
            displayText.trim()
          );
        }

        /*
          Translate only final sentence
        */

        if (finalText.trim()) {
          const cleanText =
            finalText.trim();

          console.log(
            "📝 Final speech:",
            cleanText
          );

          translateText(cleanText);
        }
      };

      /* ===================================================
         ON ERROR
      =================================================== */

      recognition.onerror = (event) => {
        const error = event.error;

        console.warn(
          "⚠️ Speech recognition:",
          error
        );

        recognitionRunningRef.current =
          false;

        /*
          User manually stopped
        */

        if (
          manualStopRecognitionRef.current ||
          !callActiveRef.current ||
          sessionId !==
            recognitionSessionRef.current
        ) {
          return;
        }

        /*
          Permission denied
        */

        if (
          error === "not-allowed" ||
          error ===
            "service-not-allowed"
        ) {
          setRecognizing(false);

          setTranslationStatus(
            "Microphone permission denied"
          );

          return;
        }

        /*
          Temporary errors

          These should NOT immediately
          create another recognition object.
        */

        if (
          error === "aborted" ||
          error === "no-speech" ||
          error === "network"
        ) {
          recognitionErrorCountRef.current += 1;

          console.log(
            `🔄 Temporary speech error: ${error}. Retry #${recognitionErrorCountRef.current}`
          );

          return;
        }

        /*
          Other errors
        */

        setTranslationStatus(
          `Speech recognition error: ${error}`
        );
      };

      /* ===================================================
         ON END
      =================================================== */

      recognition.onend = () => {
        console.log(
          "🎤 Speech recognition ended"
        );

        recognitionRunningRef.current =
          false;

        /*
          Old recognition instance
        */

        if (
          sessionId !==
          recognitionSessionRef.current
        ) {
          return;
        }

        /*
          User stopped / call ended
        */

        if (
          !callActiveRef.current ||
          manualStopRecognitionRef.current
        ) {
          setRecognizing(false);

          console.log(
            "🛑 Speech recognition stopped"
          );

          return;
        }

        /*
          Calculate retry delay

          Retry #1 = 1 sec
          Retry #2 = 2 sec
          Retry #3 = 3 sec
          Maximum = 5 sec
        */

        const errorCount =
          recognitionErrorCountRef.current;

        const retryDelay = Math.min(
          1000 +
            Math.max(
              errorCount - 1,
              0
            ) *
              1000,
          5000
        );

        console.log(
          `🔄 Restarting speech recognition in ${retryDelay}ms`
        );

        setTranslationStatus(
          "Reconnecting speech recognition..."
        );

        /*
          Cancel existing timer
        */

        if (
          recognitionRestartTimerRef.current
        ) {
          clearTimeout(
            recognitionRestartTimerRef.current
          );
        }

        /*
          Create NEW recognition object
        */

        recognitionRestartTimerRef.current =
          setTimeout(() => {
            recognitionRestartTimerRef.current =
              null;

            if (
              !callActiveRef.current ||
              manualStopRecognitionRef.current ||
              sessionId !==
                recognitionSessionRef.current
            ) {
              return;
            }

            const newRecognition =
              createRecognition();

            if (!newRecognition) {
              return;
            }

            try {
              newRecognition.start();

              console.log(
                "🚀 New speech recognition instance started"
              );
            } catch (error) {
              console.warn(
                "Speech recognition start failed:",
                error
              );

              recognitionRunningRef.current =
                false;

              /*
                Retry after 2 seconds
              */

              recognitionRestartTimerRef.current =
                setTimeout(() => {
                  recognitionRestartTimerRef.current =
                    null;

                  if (
                    callActiveRef.current &&
                    !manualStopRecognitionRef.current &&
                    sessionId ===
                      recognitionSessionRef.current &&
                    !recognitionRunningRef.current
                  ) {
                    const retryRecognition =
                      createRecognition();

                    if (!retryRecognition) {
                      return;
                    }

                    try {
                      retryRecognition.start();

                      console.log(
                        "🚀 Speech recognition retry started"
                      );
                    } catch (retryError) {
                      console.error(
                        "Speech recognition retry failed:",
                        retryError
                      );
                    }
                  }
                }, 2000);
            }
          }, retryDelay);
      };

      return recognition;
    };

    /* =====================================================
       CREATE FIRST INSTANCE
    ===================================================== */

    const recognition =
      createRecognition();

    if (!recognition) {
      return;
    }

    try {
      recognition.start();

      console.log(
        "🚀 Starting continuous voice translation"
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

  /* =====================================================
     STOP VOICE RECOGNITION
  ===================================================== */

  const stopVoiceTranslation = () => {
    console.log(
      "🛑 Stopping voice translation"
    );

    /*
      First stop automatic restart
    */

    manualStopRecognitionRef.current =
      true;

    /*
      Invalidate current session
    */

    recognitionSessionRef.current += 1;

    /*
      Cancel pending restart timer
    */

    if (recognitionRestartTimerRef.current) {
      clearTimeout(
        recognitionRestartTimerRef.current
      );

      recognitionRestartTimerRef.current =
        null;
    }

    /*
      Get current recognition
    */

    const recognition =
      recognitionRef.current;

    recognitionRef.current = null;

    recognitionRunningRef.current =
      false;

    /*
      Remove callbacks first

      This prevents onend from restarting
      recognition.
    */

    if (recognition) {
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;

      try {
        recognition.stop();
      } catch (error) {
        console.log(
          "Recognition already stopped:",
          error
        );
      }
    }

    setRecognizing(false);

    setTranslationStatus(
      "Voice translation stopped"
    );
  };

  /* =====================================================
     CLEAR TRANSLATION
  ===================================================== */

  const clearTranslation = () => {
    setOriginalText("");
    setTranslatedText("");

    setTranslationStatus(
      "Ready"
    );

    if (
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }
  };

  /* =====================================================
     SPEAK TRANSLATED TEXT
  ===================================================== */

  const speakTranslation = () => {
    if (!translatedText.trim()) {
      return;
    }

    if (
      !("speechSynthesis" in window)
    ) {
      alert(
        "Text-to-Speech browser mein supported nahi hai."
      );

      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        translatedText
      );

    utterance.lang =
      getSpeechLanguage(toLanguage);

    utterance.rate = 0.95;
    utterance.pitch = 1;

    window.speechSynthesis.speak(
      utterance
    );
  };

  /* =====================================================
     END CALL
  ===================================================== */

  const endCall = () => {
    console.log(
      "🔴 Ending call..."
    );

    /*
      Completely stop automatic
      speech recognition restart
    */

    callActiveRef.current = false;

    manualStopRecognitionRef.current =
      true;

    /*
      Invalidate recognition session
    */

    recognitionSessionRef.current += 1;

    /*
      Cancel pending restart timer
    */

    if (recognitionRestartTimerRef.current) {
      clearTimeout(
        recognitionRestartTimerRef.current
      );

      recognitionRestartTimerRef.current =
        null;
    }

    /*
      Stop current recognition
    */

    if (recognitionRef.current) {
      const recognition =
        recognitionRef.current;

      recognitionRef.current = null;

      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;

      try {
        recognition.stop();
      } catch (error) {
        console.log(
          "Recognition already stopped:",
          error
        );
      }
    }

    recognitionRunningRef.current =
      false;

    setRecognizing(false);

    /*
      Stop text-to-speech
    */

    if (
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }

    /*
      Stop local media
    */

    if (localStreamRef.current) {
      localStreamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      localStreamRef.current = null;
    }

    /*
      Close WebRTC
    */

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();

      peerConnectionRef.current = null;
    }

    pendingIceCandidatesRef.current = [];

    /*
      Leave socket room
    */

    if (socket.connected) {
      socket.emit("leave-room", {
        roomId,
      });

      socket.disconnect();
    }

    setConnected(false);

    /*
      Navigate back
    */

    if (onEndCall) {
      onEndCall();
    }
  };

  /* =====================================================
     UI
  ===================================================== */

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
          maxWidth: "1450px",
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
            marginBottom: "20px",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "25px",
              }}
            >
              BhashaSetu Interview
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
                : "● Waiting for interviewer..."}
            </p>
          </div>

          <div
            style={{
              background: "#1e293b",
              padding: "10px 16px",
              borderRadius: "10px",
            }}
          >
            <strong>
              Room:
            </strong>{" "}
            {roomId}
          </div>
        </div>

        {/* =================================================
            MAIN LAYOUT
        ================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0, 1fr) 390px",
            gap: "20px",
            alignItems: "start",
          }}
        >
          {/* =================================================
              LEFT VIDEO AREA
          ================================================= */}

          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
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
                    background:
                      "rgba(0,0,0,0.65)",
                    padding: "8px 12px",
                    borderRadius: "8px",
                  }}
                >
                  You
                </div>

                <div
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    background:
                      "rgba(0,0,0,0.65)",
                    padding: "7px 10px",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                >
                  {fromLanguage}
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
                      textAlign: "center",
                      padding: "20px",
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
                    background:
                      "rgba(0,0,0,0.65)",
                    padding: "8px 12px",
                    borderRadius: "8px",
                  }}
                >
                  Interviewer
                </div>

                <div
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    background:
                      "rgba(0,0,0,0.65)",
                    padding: "7px 10px",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                >
                  {toLanguage}
                </div>
              </div>
            </div>

            {/* =================================================
                CALL CONTROLS
            ================================================= */}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                marginTop: "20px",
                flexWrap: "wrap",
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
                  background: micOn
                    ? "#1e293b"
                    : "#7f1d1d",
                  color: "white",
                  fontWeight: "600",
                }}
              >
                {micOn
                  ? "🎤 Mic On"
                  : "🔇 Mic Off"}
              </button>

              <button
                type="button"
                onClick={toggleCamera}
                style={{
                  padding: "12px 20px",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  background: cameraOn
                    ? "#1e293b"
                    : "#7f1d1d",
                  color: "white",
                  fontWeight: "600",
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
                  fontWeight: "600",
                }}
              >
                🔴 End Call
              </button>
            </div>
          </div>

          {/* =================================================
              RIGHT TRANSLATION PANEL
          ================================================= */}

          <div
            style={{
              background: "#ffffff",
              color: "#0f172a",
              borderRadius: "18px",
              padding: "20px",
              boxSizing: "border-box",
              boxShadow:
                "0 15px 40px rgba(0,0,0,0.25)",
            }}
          >
            {/* PANEL HEADER */}

            <div
              style={{
                marginBottom: "18px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 5px",
                  fontSize: "21px",
                }}
              >
                🌐 Live Translation
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                Continuous Voice + Text Translation
              </p>
            </div>

            {/* =================================================
                LANGUAGE SELECTORS
            ================================================= */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 42px 1fr",
                gap: "8px",
                alignItems: "end",
                marginBottom: "18px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "700",
                    marginBottom: "6px",
                    color: "#475569",
                  }}
                >
                  YOU SPEAK
                </label>

                <select
                  value={fromLanguage}
                  onChange={(e) => {
                    if (
                      recognitionRunningRef.current
                    ) {
                      stopVoiceTranslation();
                    }

                    setFromLanguage(
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
                    padding: "11px",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius: "9px",
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
                  width: "42px",
                  height: "42px",
                  border: "none",
                  borderRadius: "9px",
                  background: "#e2e8f0",
                  cursor: "pointer",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                ⇄
              </button>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "700",
                    marginBottom: "6px",
                    color: "#475569",
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
                      "Target language changed"
                    );
                  }}
                  style={{
                    width: "100%",
                    padding: "11px",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius: "9px",
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
                LANGUAGE DIRECTION
            ================================================= */}

            <div
              style={{
                textAlign: "center",
                background: "#eff6ff",
                color: "#1d4ed8",
                borderRadius: "9px",
                padding: "9px",
                marginBottom: "18px",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              {fromLanguage} →{" "}
              {toLanguage}
            </div>

            {/* =================================================
                VOICE TRANSLATION BUTTON
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
                padding: "14px",
                border: "none",
                borderRadius: "11px",
                cursor: "pointer",
                background: recognizing
                  ? "#dc2626"
                  : "#2563eb",
                color: "white",
                fontSize: "15px",
                fontWeight: "700",
                marginBottom: "15px",
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
                marginBottom: "15px",
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
                YOUR SPEECH / TEXT
            ================================================= */}

            <div
              style={{
                background: "#f8fafc",
                border:
                  "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "14px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginBottom: "8px",
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

              <div
                style={{
                  minHeight: "70px",
                  color: originalText
                    ? "#0f172a"
                    : "#94a3b8",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                {originalText ||
                  "Your recognized speech will appear here..."}
              </div>
            </div>

            {/* =================================================
                TRANSLATED TEXT
            ================================================= */}

            <div
              style={{
                background: "#eff6ff",
                border:
                  "1px solid #bfdbfe",
                borderRadius: "12px",
                padding: "14px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginBottom: "8px",
                }}
              >
                <strong
                  style={{
                    fontSize: "13px",
                  }}
                >
                  🌐 Translation
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

              <div
                style={{
                  minHeight: "70px",
                  color: translatedText
                    ? "#0f172a"
                    : "#94a3b8",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                {translatedText ||
                  "Translated text will appear here..."}
              </div>
            </div>

            {/* =================================================
                VOICE OUTPUT
            ================================================= */}

            <button
              type="button"
              onClick={
                speakTranslation
              }
              disabled={!translatedText}
              style={{
                width: "100%",
                padding: "12px",
                border: "none",
                borderRadius: "10px",
                cursor: translatedText
                  ? "pointer"
                  : "not-allowed",
                background: translatedText
                  ? "#16a34a"
                  : "#cbd5e1",
                color: "white",
                fontWeight: "700",
                marginBottom: "10px",
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
                borderRadius: "10px",
                cursor: "pointer",
                background: "white",
                color: "#475569",
                fontWeight: "600",
              }}
            >
              🗑 Clear Translation
            </button>

            {/* =================================================
                INFO
            ================================================= */}

            <div
              style={{
                marginTop: "16px",
                padding: "12px",
                borderRadius: "10px",
                background: "#f8fafc",
                fontSize: "11px",
                lineHeight: "1.6",
                color: "#64748b",
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
              5. Every final sentence is translated.
              <br />
              6. Translated voice is played.
              <br />
              7. If browser stops recognition, it reconnects automatically.
              <br />
              8. Recognition uses a new session after restart.
              <br />
              9. It continues until Stop Listening or End Call.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;