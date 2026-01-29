const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up SQLite database
const db = new sqlite3.Database('./names.db');
db.run("CREATE TABLE IF NOT EXISTS users(name TEXT)");

// API endpoint to receive and store names
app.post("/api/greet", (req, res) => {
  const { name } = req.body;
  db.run("INSERT INTO users(name) VALUES(?)", [name], (err) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: `You suck, ${name}!` });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});