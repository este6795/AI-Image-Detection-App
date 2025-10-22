const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// request logger to confirm incoming requests and paths
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

const products = [
  { id: 1, name: 'Coffee Beans', qty: 25, price: 8.0 },
  { id: 2, name: 'Tea Bags', qty: 50, price: 5.0 }
];

app.get('/api/ping', (req, res) => res.json({ ok: true }));
app.get('/api/products', (req, res) => res.json(products));

// bind to 0.0.0.0 so devcontainer/host can reach it
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;