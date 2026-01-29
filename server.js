const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up SQLite database
const db = new Database('./names.db');
db.prepare("CREATE TABLE IF NOT EXISTS users(name TEXT)").run();

// API endpoint to receive and store names
app.post("/api/greet", (req, res) => {
  const { name } = req.body;
  try {
    db.prepare("INSERT INTO users(name) VALUES(?)").run(name);
    res.json({ message: `You suck, ${name}!` });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});