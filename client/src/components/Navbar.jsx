import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <div className="logo-icon">भ</div>
        <div>
          <h2>BhashaSetu</h2>
          <span>AI Language Bridge</span>
        </div>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/learn">Learn</Link>
        <Link to="/translation">Translate</Link>
        <Link to="/voice">Voice AI</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>

      <button className="start-btn">Start Learning</button>
    </nav>
  );
};

export default Navbar;