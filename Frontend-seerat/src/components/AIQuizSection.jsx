import React, { useState } from "react";
import "./AIQuizSection.css";

const AIQuizSection = () => {
  const images = [
    { src: "/images/ai1.png", type: "AI" },
    { src: "images/ai2.png", type: "AI" },
    { src: "images/real1.png", type: "Real" },
    { src: "images/real2.png", type: "Real" },
    { src: "images/ai3.png", type: "AI" },
    { src: "images/real3.png", type: "Real" },
    { src: "images/real4.png", type: "Real" },
    { src: "images/ai4.png", type: "AI" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [quizComplete, setQuizComplete] = useState(false);

  const handleGuess = (guess) => {
    if (quizComplete) return;

    if (guess === images[currentIndex].type) {
      setFeedback("✅ Correct!");
      setScore(score + 1);
    } else {
      setFeedback("❌ Wrong! It was " + images[currentIndex].type);
    }
  };

  const nextImage = () => {
    if (currentIndex + 1 < images.length) {
      setCurrentIndex(currentIndex + 1);
      setFeedback("");
    } else {
      setQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setFeedback("");
    setQuizComplete(false);
  };

  const progress = ((currentIndex + (quizComplete ? 1 : 0)) / images.length) * 100;

  return (
    <section className="ai-quiz-wrapper">
      <div className="ai-quiz-header">
        <h2 className="ai-quiz-title">AI vs Real Quiz</h2>
        <p className="ai-quiz-subtitle">Guess if the image is AI-generated or real!</p>
      </div>

      <div className="ai-quiz-card">
        {!quizComplete ? (
          <>
            <div className="image-container">
              <img src={images[currentIndex].src} alt="quiz" className="quiz-image" />
            </div>

            <div className="buttons">
              <button onClick={() => handleGuess("AI")}>AI</button>
              <button onClick={() => handleGuess("Real")}>Real</button>
            </div>

            {feedback && <p className="feedback">{feedback}</p>}

            <button className="next-btn" onClick={nextImage}>Next Image</button>
          </>
        ) : (
          <>
            <h3 className="feedback">🏆 Quiz Complete!</h3>
            <p>Your final score: {score}/{images.length}</p>
            <button className="next-btn" onClick={restartQuiz}>Restart Quiz</button>
          </>
        )}

        <div className="score-progress">
          <p>Score: {score}/{images.length}</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIQuizSection;