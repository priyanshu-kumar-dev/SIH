
import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-page">

      <div className="dashboard-header">
        <span className="badge">Learning Dashboard</span>

        <h1>Welcome to BhashaSetu 👋</h1>

        <p>
          Track your language learning journey and improve
          your Hindi and English skills.
        </p>
      </div>

      {/* STATS */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <h3>12</h3>
          <p>Lessons Completed</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <h3>7</h3>
          <p>Day Learning Streak</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🌐</div>
          <h3>85%</h3>
          <p>Translation Accuracy</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <h3>420</h3>
          <p>Learning Points</p>
        </div>

      </div>

      {/* CONTENT */}

      <div className="dashboard-content">

        {/* PROGRESS */}

        <div className="progress-card">

          <h2>Your Progress</h2>

          <p>
            Keep learning to improve your language skills.
          </p>

          <div className="progress-item">
            <div className="progress-info">
              <span>Hindi</span>
              <span>75%</span>
            </div>

            <div className="progress-bar">
              <div className="progress-fill hindi"></div>
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-info">
              <span>English</span>
              <span>60%</span>
            </div>

            <div className="progress-bar">
              <div className="progress-fill english"></div>
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-info">
              <span>Translation</span>
              <span>85%</span>
            </div>

            <div className="progress-bar">
              <div className="progress-fill translation"></div>
            </div>
          </div>

        </div>

        {/* ACTIVITY */}

        <div className="activity-card">

          <h2>Recent Activity</h2>

          <div className="activity">
            <div className="activity-icon">📖</div>

            <div className="activity-info">
              <h4>Completed Hindi Basics</h4>
              <p>Today</p>
            </div>
          </div>

          <div className="activity">
            <div className="activity-icon">🌐</div>

            <div className="activity-info">
              <h4>Used AI Translation</h4>
              <p>Yesterday</p>
            </div>
          </div>

          <div className="activity">
            <div className="activity-icon">🎤</div>

            <div className="activity-info">
              <h4>Practiced Voice AI</h4>
              <p>2 days ago</p>
            </div>
          </div>

        </div>

      </div>

      {/* CONTINUE */}

      <div className="continue-section">

        <div>
          <h2>Ready to continue learning?</h2>

          <p>
            Continue your Hindi and English lessons.
          </p>
        </div>

        <Link to="/learn">
          <button className="continue-btn">
            Continue Learning →
          </button>
        </Link>

      </div>

    </div>
  );
};

export default Dashboard;

