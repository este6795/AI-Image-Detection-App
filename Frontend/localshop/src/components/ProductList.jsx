import React from 'react'
import { useState, useEffect } from 'react';
const ProductList = () => {
const [products, setProducts] = useState([]);
useEffect(() => {
fetch("http://localhost:5000/api/products")
.then((response) => response.json()) .then((data) => setProducts(data))
.catch((error) => console.error("Error fetching products:", error));
}, []);
return (
<div>
<h1>Product List</h1>
<ul>
{products.map((product) => (
<li key={product.id}> {product.name} - ${product.price} (Qty: {product.qty}) </li>
))}
</ul>
</div>
)
}
export default ProductList