const express = require('express');
const cors = require('cors');

// /workspaces/AI-Image-Detection-App/Backend/server.js

const app = express();

app.use(cors());
app.use(express.json());

// Root
app.get('/', (req, res) => {
    res.json({ message: 'AI Image Detection Backend', version: '0.1.0' });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

// Dummy detect endpoint
// Expects JSON: { "imageUrl": "https://..." }
app.post('/detect', (req, res) => {
    const { imageUrl } = req.body;
    if (!imageUrl) {
        return res.status(400).json({ error: 'imageUrl is required' });
    }

    // Placeholder detection result
    const detection = {
        imageUrl,
        detections: [
            { label: 'person', confidence: 0.98, bbox: [120, 45, 220, 340] },
            { label: 'dog', confidence: 0.87, bbox: [320, 120, 420, 300] }
        ],
        processedAt: new Date().toISOString()
    };

    res.json({ ok: true, detection });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

module.exports = app;