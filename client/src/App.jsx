import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
// import Login from "./components/User/Login";
// import Signup from "./components/User/Signup";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Translation from "./pages/Translation";
import VoiceTranslation from "./pages/VoiceTranslation";
import Learn from "./pages/Learn";
import AITutor from "./pages/AITutor";
import OfflineLearning from "./pages/OfflineLearning";
import Calls from "./pages/Calls";
import CreateInterview from "./pages/CreateInterview";
import JoinInterview from "./pages/JoinInterview";
import InterviewRoom from "./pages/InterviewRoom";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/translation" element={<Translation />} />
        <Route path="/voice" element={<VoiceTranslation />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/ai-tutor" element={<AITutor />} />
        <Route path="/offline-learning" element={<OfflineLearning />} />
        <Route path="/Calls" element={<Calls />} />
        <Route path="/create-interview" element={<CreateInterview />} />
        <Route path="/join-interview" element={<JoinInterview />} />
        <Route path="/interview/:roomId" element={<InterviewRoom />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> */}
        <Route path="/voice-call/:roomId" element={<InterviewRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
