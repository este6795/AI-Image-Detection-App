import React, { useState } from "react";
import ImageDetector from "./components/ImageDetector";
import ShowHistory from "./components/ShowHistory";
import "./App.css"; // make sure this is imported

const App = () => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="app">
      <nav className="navbar">
        <button
          onClick={() => setShowHistory(false)}
          className={`nav-btn ${!showHistory ? "active" : ""}`}
        >
          🧠 Detect
        </button>
        <button
          onClick={() => setShowHistory(true)}
          className={`nav-btn ${showHistory ? "active" : ""}`}
        >
          🕓 Show History
        </button>
      </nav>

      <main className="content">
        <div className="content-box">
          {showHistory ? <ShowHistory /> : <ImageDetector />}
        </div>
      </main>
    </div>
  );
};

export default App;
