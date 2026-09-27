import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* LOGO */}
      <Link to="/" className="logo">
        <div className="logo-icon">भ</div>

        <div className="logo-text">
          <h2>BhashaSetu</h2>
          <span>AI Language Bridge</span>
        </div>
      </Link>

      {/* NAVIGATION */}
      <div className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/learn">Learn</Link>

        <Link to="/ai-tutor">AI Tutor</Link>

        <Link to="/translation">Translate</Link>

        <Link to="/voice">Voice AI</Link>

        <Link to="/offline-learning">Offline</Link>

        <Link to="/Calls" >
          Communicatation
        </Link>
      </div>

      {/* AUTHENTICATION */}
      <div className="auth-buttons">
        <Link to="/login" className="start-btn login-btn">
          Login
        </Link>

        <Link to="/signup" className="start-btn signup-btn">
          Signup
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
