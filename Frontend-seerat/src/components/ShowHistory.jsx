import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ShowHistory.css";

const ShowHistory = ({ isAdmin = false }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      console.log("[HISTORY] Fetching results from", BACKEND_URL + "/api/results");
      const res = await axios.get(BACKEND_URL + "/api/results", {
        withCredentials: true,
      });
      console.log("[HISTORY] Received", res.data.length, "results");
      setHistory(res.data);
    } catch (err) {
      console.error("[HISTORY] Error fetching results:", err);
      console.error("[HISTORY] Status:", err.response?.status);
      console.error("[HISTORY] Data:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResult = async (id) => {
    if (window.confirm("Are you sure you want to delete this result?")) {
      try {
        await axios.delete(`${BACKEND_URL}/api/results/${id}`, {
          withCredentials: true,
        });
        console.log("[HISTORY] Result deleted:", id);
        setHistory(history.filter(item => item._id !== id));
      } catch (err) {
        console.error("[HISTORY] Error deleting result:", err);
        alert("Error deleting result: " + (err.response?.data?.error || err.message));
      }
    }
  };

  if (loading) return <p>Loading history...</p>;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🕓 Detection History {isAdmin && "(ADMIN VIEW - All Users)"}</h2>

      {history.length > 0 ? (
        history.slice(0, 10).map((item) => {
          const aiScore =
            item.result?.type?.ai_generated ?? item.result?.type?.ai ?? 0;
          const confidence = (1 - aiScore) * 100;
          const isAI = aiScore >= 0.5;
          const text = isAI
            ? `🔴 AI-generated Image (${(aiScore * 100).toFixed(2)}%)`
            : `🟢 Real Image (${confidence.toFixed(2)}%)`;

          return (
            <div
              key={item._id}
              style={{
                marginBottom: "20px",
                backgroundColor: "#1e1e1eff",
                borderRadius: "10px",
                padding: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={`${BACKEND_URL}/api/results/image/${item._id}`}
                alt="Detected"
                onLoad={() => console.log("[HISTORY] Image loaded:", item._id)}
                onError={(e) => console.error("[HISTORY] Image failed to load:", item._id, e)}
                style={{
                  width: "150px",
                  borderRadius: "8px",
                  marginBottom: "8px",
                }}
              />
              <p style={{ color: isAI ? "red" : "green" }}>{item.filename}</p>
              <p>{text}</p>
              {isAdmin && item.userId?.email && (
                <p style={{ fontSize: "12px", color: "#888" }}>
                  By: {item.userId.email}
                </p>
              )}
              {isAdmin && (
                <button
                  onClick={() => handleDeleteResult(item._id)}
                  style={{
                    marginTop: "10px",
                    padding: "6px 12px",
                    background: "linear-gradient(135deg, #ff006e 0%, #ff4757 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          );
        })
      ) : (
        <p>No previous detections found.</p>
      )}
    </div>
  );
};

export default ShowHistory;
