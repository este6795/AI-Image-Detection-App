import React from "react";
import "./StatsSection.css";

const StatsSection = () => {
  return (
    <section className="stats-section">
      <h2 className="stats-title">AI Image Insights</h2>
      <div className="stats-grid">
        <div className="stat-box">
          <h3>Hyper-Realistic Fabrication</h3>
          <p>AI models create faces, objects, and scenes that look real but never existed.</p>
        </div>
        <div className="stat-box">
          <h3>Identity Manipulation</h3>
          <p>Fake profile photos, deepfake faces, and altered identities can be mass-produced effortlessly.</p>
        </div>
        <div className="stat-box">
          <h3>Event Fabrication</h3>
          <p>AI can generate photos of events that never happened — from political rallies to natural disasters.</p>
        </div>
        <div className="stat-box">
          <h3>Cons</h3>
          <p>Misinformation & fake news, Identity scams and fraud,Privacy violations, Reputation damage, Decreased trust in online content    </p>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;