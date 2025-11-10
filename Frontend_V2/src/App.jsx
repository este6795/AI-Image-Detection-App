import React, { useState } from "react";
import ImageDetector from "./components/ImageDetector";
import ShowHistory from "./components/ShowHistory";

const App = () => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div>
      <nav
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#222",
          color: "#fff",
          padding: "10px",
        }}
      >
        <button
          onClick={() => setShowHistory(false)}
          style={{
            background: showHistory ? "#444" : "#4CAF50",
            color: "white",
            border: "none",
            padding: "10px 20px",
            marginRight: "10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          🧠 Detect
        </button>
        <button
          onClick={() => setShowHistory(true)}
          style={{
            background: showHistory ? "#4CAF50" : "#444",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          🕓 Show History
        </button>
      </nav>

      {showHistory ? <ShowHistory /> : <ImageDetector />}
    </div>
  );
};

export default App;
