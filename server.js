const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Create Postgres connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false } // required for Render's Postgres
});

// Ensure table exists
(async () => {
  try {
    await pool.query("CREATE TABLE IF NOT EXISTS users (name TEXT)");
    console.log("Table ready");
  } catch (err) {
    console.error("Error creating table:", err);
  }
})();

// API endpoint to receive and store names
app.post("/api/greet", async (req, res) => {
  const { name } = req.body;
  try {
    await pool.query("INSERT INTO users(name) VALUES($1)", [name]);
    res.json({ message: `You suck, ${name}!` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});