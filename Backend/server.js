const express = require('express');
const cors = require('cors');
const app = express();

//Middleware
app.use(cors());

//Allow frontend to access backend
app.use(express.json());
const products = [
    { id: 1, name: 'Coffee Beans', qty: 25, price: 8.0 }, 
    { id: 2, name: 'Tea Bags', qty: 50, price: 5.0 }
];


//Testing Connection
app.get('/api/ping', (req, res) => res.json({ ok: true })); // to test connection
app.get('/api/products', (req, res) => res.json(products));


//Start server and listen on the Specified Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});