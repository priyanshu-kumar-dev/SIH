import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
// import { login } from "../components/User/Login";
// import { signup } from "../components/User";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo">
        <div className="logo-icon">भ</div>

        <div>
          <h2>BhashaSetu</h2>
          <span>AI Language Bridge</span>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/learn">Learn</Link>
        <Link to="/translation">Translate</Link>
        <Link to="/voice">Voice AI</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>

      {/* Authentication */}
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
