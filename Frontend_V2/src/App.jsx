import React, { useState } from "react";
import MissionSection from "./components/MissionSection";
import StatsSection from "./components/StatsSection";
import ImageDetector from "./components/ImageDetector";
import ShowHistory from "./components/ShowHistory";
import LandingPage from "./components/LandingPage";
import "./App.css";

const App = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="app">
      {showLanding ? (
        <LandingPage onStart={() => setShowLanding(false)} />
      ) : (
        <>
          {/* VIDEO HERO SECTION */}
          <section className="video-hero">
            <video className="hero-video" autoPlay loop muted>
              <source src="/videos/bubble1.mp4" type="video/mp4" />
            </video>
            <div className="hero-overlay">
              <h1 className="hero-title">Detect AI Generated Images</h1>
              <p className="hero-desc">
                Quickly analyze any image to determine if it was AI generated or naturally captured.
              </p>
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