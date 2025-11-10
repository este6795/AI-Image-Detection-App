import React, { useEffect, useState } from "react";
import axios from "axios";

const ShowHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/results");
        setHistory(res.data);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <p>Loading history...</p>;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🕓 Detection History</h2>

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
                src={`http://localhost:5000/api/images/${item._id}`}
                alt="Detected"
                style={{
                  width: "150px",
                  borderRadius: "8px",
                  marginBottom: "8px",
                }}
              />
              <p style={{ color: isAI ? "red" : "green" }}>{item.filename}</p>
              <p>{text}</p>
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
