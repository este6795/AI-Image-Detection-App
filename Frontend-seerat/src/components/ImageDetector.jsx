import React, { useState } from "react";
import axios from "axios";
import "./ImageDetector.css";

const ImageDetector = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Select an image first.");

    const formData = new FormData();
    formData.append("image", selectedFile);

    setLoading(true);
    try {
      console.log("[FRONTEND] Sending image to http://localhost:5000/detect");
      const res = await axios.post("http://localhost:5000/detect", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("[FRONTEND] Response received:", res.data);
      
      if (res.data.success && res.data.result) {
        console.log("[FRONTEND] Setting result:", res.data.result);
        setResult(res.data.result);
      } else {
        console.error("[FRONTEND] Invalid response structure:", res.data);
        alert("Error: Invalid response from server.");
      }
    } catch (err) {
      console.error("[FRONTEND] Error analyzing image:");
      console.error("Status:", err.response?.status);
      console.error("Data:", err.response?.data);
      console.error("Message:", err.message);
      alert("Error analyzing image: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceText = (res) => {
    const aiScore = res?.type?.ai_generated ?? null;
    if (aiScore === null) return "No data";

    const confidence = (1 - aiScore) * 100;
    return aiScore < 0.5
      ? `🟢 Real Image (${confidence.toFixed(2)}% confidence)`
      : `🔴 AI-generated Image (${(aiScore * 100).toFixed(2)}% confidence)`;
  };

  return (
    <div className="detector-wrapper">
      
      <div className="detector-header">
        <h1 className="detector-title">AI Image Authenticity Checker</h1>
        <p className="detector-subtitle">
          Analyze any image with high-accuracy machine intelligence.
        </p>
      </div>

      <div className="detector-card">

        <form onSubmit={handleSubmit} className="detector-form">
          <label className="upload-label">
            <span>Select Image</span>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>

          <button type="submit" className="detect-btn" disabled={loading}>
            {loading ? "Analyzing..." : "Detect Image"}
          </button>
        </form>

        {selectedFile && (
          <div className="preview-box">
            <img src={URL.createObjectURL(selectedFile)} alt="preview" />
            {result && (
              <h3 className="result-output">{getConfidenceText(result)}</h3>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default ImageDetector;