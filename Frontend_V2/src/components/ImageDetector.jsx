import React, { useState } from "react";
import axios from "axios";

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
    if (!selectedFile) return alert("Please select an image first");

    const formData = new FormData();
    formData.append("image", selectedFile);

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/detect", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data.result);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze image");
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceText = (res) => {
    const aiScore = res?.type?.ai_generated ?? null;
    if (aiScore === null) return "No data available";

    const confidence = (1 - aiScore) * 100;
    return aiScore < 0.5
      ? `🟢 Real Image (${confidence.toFixed(2)}% confidence)`
      : `🔴 AI-generated Image (${(aiScore * 100).toFixed(2)}% confidence)`;
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", maxWidth: "700px", margin: "auto" }}>
      <h1>🧠 AI Image Detector</h1>

      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit" disabled={loading} style={{ marginLeft: "10px" }}>
          {loading ? "Analyzing..." : "Upload & Detect"}
        </button>
      </form>

      {selectedFile && (
        <div style={{ marginTop: "20px" }}>
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="preview"
            style={{ maxWidth: "100%", borderRadius: "8px", marginBottom: "10px" }}
          />
          {result && (
            <h3 style={{ color: result?.type?.ai_generated > 0.5 ? "red" : "green" }}>
              {getConfidenceText(result)}
            </h3>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageDetector;
