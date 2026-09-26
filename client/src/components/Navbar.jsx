import React from "react";
import { Link } from "react-router-dom";
<<<<<<< HEAD
import "./Navbar.css";
=======
// import { login } from "../components/User/Login";
// import { signup } from "../components/User";
>>>>>>> 818830660ec9b58b2c38c5f393b7e7ba36c57ee9

const Navbar = () => {
  return (
    <nav className="navbar">
<<<<<<< HEAD
      {/* LOGO */}
      <Link to="/" className="logo">
        <div className="logo-icon">भ</div>

        <div className="logo-text">
=======
      {/* Logo */}
      <Link to="/" className="logo">
        <div className="logo-icon">भ</div>

        <div>
>>>>>>> 818830660ec9b58b2c38c5f393b7e7ba36c57ee9
          <h2>BhashaSetu</h2>
          <span>AI Language Bridge</span>
        </div>
      </Link>

<<<<<<< HEAD
      {/* NAVIGATION */}
=======
      {/* Navigation Links */}
>>>>>>> 818830660ec9b58b2c38c5f393b7e7ba36c57ee9
      <div className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/learn">Learn</Link>

        <Link to="/ai-tutor">AI Tutor</Link>

        <Link to="/translation">Translate</Link>

        <Link to="/voice">Voice AI</Link>

        <Link to="/offline-learning">Offline</Link>
      </div>

<<<<<<< HEAD
      {/* ACTION */}
      <Link to="/learn" className="start-btn">
        Start Learning
      </Link>
=======
      {/* Authentication */}
      <div className="auth-buttons">
        <Link to="/login" className="start-btn login-btn">
          Login
        </Link>

        <Link to="/signup" className="start-btn signup-btn">
          Signup
        </Link>
      </div>
>>>>>>> 818830660ec9b58b2c38c5f393b7e7ba36c57ee9
    </nav>
  );
};

export default Navbar;
