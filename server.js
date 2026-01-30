const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,     // e.g. "aws.connect.psdb.cloud"
  user: process.env.DB_USER,     // your username
  password: process.env.DB_PASS, // your password
  database: process.env.DB_NAME, // your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Ensure table exists
(async () => {
  const conn = await pool.getConnection();
  await conn.query("CREATE TABLE IF NOT EXISTS users (name VARCHAR(255))");
  conn.release();
})();

// API endpoint to receive and store names
app.post("/api/greet", async (req, res) => {
  const { name } = req.body;
  try {
    await pool.query("INSERT INTO users(name) VALUES(?)", [name]);
    res.json({ message: `You suck, ${name}!` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});