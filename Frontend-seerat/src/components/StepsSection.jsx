import React from "react";
import "./StepsSection.css";

const StepsSection = () => {
  const steps = [
    {
      title: "1. Check the Eyes",
      desc: "AI-generated images often have distorted or asymmetrical eyes. Look for unnatural reflections or shapes."
    },
    {
      title: "2. Look at the Hands",
      desc: "Hands are tricky for AI. Fingers may be extra, missing, or oddly shaped."
    },
    {
      title: "3. Inspect Backgrounds",
      desc: "AI may generate blurry, inconsistent, or repetitive backgrounds. Look for strange patterns."
    },
    {
      title: "4. Analyze Text",
      desc: "Text in AI images often looks jumbled or nonsensical. Signs of poor typography are red flags."
    },
    {
      title: "5. Lighting & Shadows",
      desc: "Check if shadows, reflections, and lighting match naturally. AI often makes inconsistent lighting."
    },
  ];

  return (
    <section className="steps-wrapper">
      <h2 className="steps-title">How to Spot AI Images</h2>
      <div className="steps-cards">
        {steps.map((step, index) => (
          <div key={index} className="step-card">
            <h3 className="step-card-title">{step.title}</h3>
            <p className="step-card-desc">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StepsSection;