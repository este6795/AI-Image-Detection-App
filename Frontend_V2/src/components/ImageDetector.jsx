import React, { useState, useEffect } from "react";
import axios from "axios";

const ImageDetector = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

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
      fetchHistory();
    } catch (err) {
      console.error(err);
      alert("Failed to analyze image");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/results");
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching results:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // 🧠 Your preferred confidence calculator
  const getConfidenceText = (res) => {
    const aiScore = res?.type?.ai_generated ?? null;
    if (aiScore === null) return "No data available";

    const confidence = (1 - aiScore) * 100;
    return aiScore < 0.5
      ? `🟢 Real Image (${confidence.toFixed(2)}% confidence)`
      : `🔴 AI-generated Image (${(aiScore * 100).toFixed(2)}% confidence)`;
  };

  const renderResult = () => {
    if (!result) return null;
    const text = getConfidenceText(result);
    const isAI = result?.type?.ai_generated >= 0.5;

    return (
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {/* Image */}
        {selectedFile && (
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Analyzed"
            style={{
              maxWidth: "100%",
              borderRadius: "12px",
              marginBottom: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          />
        )}
        {/* Result */}
        <h3 style={{ color: isAI ? "red" : "green" }}>{text}</h3>
      </div>
    );
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        maxWidth: "700px",
        margin: "auto",
      }}
    >
      <h1>🧠 AI Image Detector</h1>

      {/* Upload form */}
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button
          type="submit"
          disabled={loading}
          style={{ marginLeft: "10px" }}
        >
          {loading ? "Analyzing..." : "Upload & Detect"}
        </button>
      </form>

      {loading && <p>Processing image, please wait...</p>}

      {renderResult()}

      <hr style={{ margin: "40px 0" }} />
      <h2>🕓 Detection History</h2>

      {history.length > 0 ? (
        history.slice(0, 5).map((item) => {
          const aiScore =
            item.result?.type?.ai_generated ?? item.result?.type?.ai ?? 0;
          const confidence = (1 - aiScore) * 100;
          const isAI = aiScore >= 0.5;
          const text = isAI
            ? `🔴 AI-generated Image (${(aiScore * 100).toFixed(2)}%)`
            : `🟢 Real Image (${confidence.toFixed(2)}%)`;

          return (
            <div key={item._id} style={{ marginBottom: "20px" }}>
              <img
                src={`http://localhost:5000/api/images/${item._id}`}
                alt="Detected"
                style={{
                  width: "150px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                }}
              />
              <p style={{ margin: "5px 0", color: isAI ? "red" : "green" }}>
                {item.filename} — {text}
              </p>
            </div>
          );
        })
      ) : (
        <p>No past detections yet.</p>
      )}
    </div>
  );
};

export default ImageDetector;
