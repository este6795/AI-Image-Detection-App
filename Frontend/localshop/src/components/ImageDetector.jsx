import { useState } from "react";

function ImageDetector() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:3000/detect", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div>
      <h2>AI Image Detector</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleSubmit}>Analyze Image</button>

      {result && (
        <pre>{JSON.stringify(result.data, null, 2)}</pre>
      )}
    </div>
  );
}

export default ImageDetector;
