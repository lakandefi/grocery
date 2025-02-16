const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.json());
app.use(cors()); // Enable CORS
require('dotenv').config();

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Required for Render
});

// Verify database connection
(async () => {
    try {
        const client = await pool.connect();
        console.log("Database connected successfully!");
        client.release();
    } catch (error) {
        console.error("Database connection failed:", error);
    }
})();

// API endpoints 

// Get all products
app.get('/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (error) {
        console.error(`Error fetching products: ${error}`);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// Add product
// app.post('/products', async (req, res) => {
//     try {
//         const { name, price, category, image } = req.body;

//         if (!name || !price) {
//             return res.status(400).json({ error: "Name and price are required."});
//         }
    
//         const result = await pool.query(
//             'INSERT INTO products (name, price, category, image) VALUES ($1, $2, $3, $4) RETURNING *', 
//             [name, price, category, image]
//         );
    
//         res.status(201).json(result.rows[0]);
//     } catch (error) {
//         console.error(`Error adding product: ${error}`);
//         res.status(500).json({ error: "Failed to add product" });
//     }
// });

// Update price
// app.put('/products/:id', async (req, res) => {

//     try {
//         const { id } = req.params;
//         const { price } = req.body;
    
//         if (!price) {
//             return res.status(400).json({ error: "Price is required." });
//         }
    
//         const result = await pool.query(
//             `UPDATE products SET price = $1 WHERE id = $2 RETURNING *`,
//             [price, id]
//         );
    
//         if (result.rowCount === 0) {
//             return res.status(404).json({ error: "Product not found." });
//         }
    
//         res.json({ message: "Product price updated successfully", updatedProduct: result.rows[0] });
//     } catch (error) {
//         console.error(`Error updating product: ${error}`);
//         res.status(500).json({ error: "Failed to update product" });  
//     }
// });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
