import React from "react";
import "./LandingPage.css";

function LandingPage({ onStart }) { // accept the callback
  return (
    <div className="landing-container">
      {/* HERO SECTION */}
      <nav className="navbar">
  <div className="logo">
    Detect<span className="ai-glow">AI</span>
  </div>

  <ul className="nav-links">
    <li><a href="#features">Features</a></li>
    <li><a href="#howitworks">How It Works</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>

  <button className="nav-btn" onClick={onStart}>Sign up</button>
</nav>

      <section className="hero">
        <h1 className="hero-title">Detect AI-Generated Images Instantly</h1>
        <p className="hero-subtitle">
          Advanced AI detection technology at your fingertips. Analyze images in seconds,  
          understand authenticity, and make informed decisions.
        </p>
        <button className="hero-btn" onClick={onStart}>Get Started</button>
      </section>

      <section className="features" id="features">
        <h2 className="section-title">Features</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Instant Analysis</h3>
            <p>Upload images and get AI detection results instantly.</p>
          </div>
          <div className="feature-card">
            <h3>History Tracking</h3>
            <p>Keep track of all analyzed images with detailed results.</p>
          </div>
          <div className="feature-card">
            <h3>Professional Accuracy</h3>
            <p>Uses cutting-edge AI technology to detect generated content.</p>
          </div>
          <div className="feature-card">
            <h3>User-Friendly UI</h3>
            <p>Sleek, easy-to-use interface with futuristic design.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works" id="howitworks">
        <h2 className="section-title">How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Upload Image</h3>
            <p>Select any image from your device to analyze.</p>
          </div>
          <div className="step">
            <h3>2. AI Detection</h3>
            <p>Our AI checks the image for generated or manipulated content.</p>
          </div>
          <div className="step">
            <h3>3. View Results</h3>
            <p>Receive a detailed report and insights in seconds.</p>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <h2 className="section-title">About DetectAI</h2>
        <p>
          DetectAI is a professional AI image detection platform designed for 
          individuals, professionals, and organizations. Our mission is to provide 
          fast, accurate, and reliable AI detection services while maintaining an 
          intuitive and futuristic interface.
        </p>
      </section>

      <footer className="footer" id="contact">
        <p>&copy; 2025 DetectAI. All rights reserved.</p>
        <p>Contact: supportdetectai@gmail.com</p>
      </footer>
    </div>
  );
}

export default LandingPage;