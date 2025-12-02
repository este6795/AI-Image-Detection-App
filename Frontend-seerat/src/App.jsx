import React, { useState, useEffect } from "react";
import MissionSection from "./components/MissionSection";
import StatsSection from "./components/StatsSection";
import ImageDetector from "./components/ImageDetector";
import ShowHistory from "./components/ShowHistory";
import LandingPage from "./components/LandingPage";
import AuthModal from "./components/AuthModal";
import "./App.css";

const App = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Check if user is already logged in on mount
  useEffect(() => {
    const authenticated = localStorage.getItem("isAuthenticated") === "true";
    const email = localStorage.getItem("userEmail");
    if (authenticated && email) {
      setIsAuthenticated(true);
      setUserEmail(email);
    }
  }, []);

  const handleSignupClick = () => {
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (email) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    setShowLanding(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    setUserEmail("");
    setShowLanding(true);
    
    // Call logout endpoint to clear server-side cookie
    axios.post("http://localhost:5000/auth/logout", {}, { withCredentials: true })
      .catch(err => console.error('[APP] Logout error:', err));
  };

  return (
    <div className="app">
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {showLanding && !isAuthenticated ? (
        <LandingPage onStart={handleSignupClick} />
      ) : (
        <>
          {/* VIDEO HERO SECTION */}
          <section className="video-hero">
            <video className="hero-video" autoPlay loop muted>
              <source src="/videos/bubble1.mp4" type="video/mp4" />
            </video>
            <div className="hero-overlay">
              <div className="hero-top-bar">
                <h1 className="hero-title">Detect AI Generated Images</h1>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
              <p className="hero-desc">
                Quickly analyze any image to determine if it was AI generated or naturally captured.
              </p>
              {isAuthenticated && (
                <p className="user-info">Welcome, {userEmail}</p>
              )}
            </div>
          </section>

          {/* LEFT CONTENT STARTS UNDER HERO */}
          <div className="left-content">
            <MissionSection />
            <StatsSection />

            {/* Buttons */}
            <div className="floating-buttons">
              <button
                className={`nav-btn ${!showHistory ? "active" : ""}`}
                onClick={() => setShowHistory(false)}
              >
                🧠 Detect Image
              </button>
              <button
                className={`nav-btn ${showHistory ? "active" : ""}`}
                onClick={() => setShowHistory(true)}
              >
                📜 History
              </button>
            </div>

            {/* Upload / Detect Section */}
            <main className="content">
              {showHistory ? <ShowHistory /> : <ImageDetector />}
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default App;