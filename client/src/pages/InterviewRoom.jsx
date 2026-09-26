import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import VideoCall from "../components/VideoCall";

const InterviewRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const handleEndCall = () => {
    navigate("/");
  };

  return (
    <VideoCall
      roomId={roomId}
      onEndCall={handleEndCall}
    />
  );
};

export default InterviewRoom;