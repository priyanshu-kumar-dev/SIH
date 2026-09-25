
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Translation from "./pages/Translation";
import VoiceTranslation from "./pages/VoiceTranslation";
import Learn from "./pages/Learn";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Main Features */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/translation" element={<Translation />} />
        <Route path="/voice" element={<VoiceTranslation />} />
        <Route path="/learn" element={<Learn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

