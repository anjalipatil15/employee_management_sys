const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Connect to SQLite database (creates file if it doesn't exist)
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) console.error(err.message);
  else console.log("✅ Connected to SQLite database");
});

// Create minimal tables if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL
  )
`);

// (Optional) registration removed to keep app minimal

// Simple demo users for convenience (kept in-memory)
const demoUsers = {
  "admin@company.com": { password: "admin123", role: "admin", name: "Admin User" },
  "hr@company.com": { password: "hr123", role: "hr", name: "HR Manager" },
  "manager@company.com": { password: "manager123", role: "manager", name: "Team Manager" },
  "employee@company.com": { password: "emp123", role: "employee", name: "John Employee" }
};

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 1) Check demo users first for a simple, working setup
  const demo = demoUsers[username];
  if (demo && demo.password === password) {
    return res.json({
      message: "✅ Login successful",
      user: { email: username, role: demo.role, name: demo.name }
    });
  }

  // 2) Fallback to DB users if present
  db.get(
    "SELECT username, password FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }
      if (row) {
        return res.json({
          message: "✅ Login successful",
          user: { email: row.username, role: "employee", name: row.username }
        });
      }
      return res.status(401).json({ error: "Invalid credentials" });
    }
  );
});

// Employees minimal CRUD (only list and create)
app.get("/employees", (req, res) => {
  db.all("SELECT id, name, email, role FROM employees ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(rows);
  });
});

app.post("/employees", (req, res) => {
  const { name, email, role } = req.body || {};
  if (!name || !email || !role) return res.status(400).json({ error: "name, email, role required" });
  // Upsert by email: insert new or update name/role if email exists
  const sql = "INSERT INTO employees(name, email, role) VALUES(?, ?, ?) ON CONFLICT(email) DO UPDATE SET name=excluded.name, role=excluded.role";
  db.run(sql, [name, email, role], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    // Return the saved row (inserted or updated)
    db.get("SELECT id, name, email, role FROM employees WHERE email = ?", [email], (err2, row) => {
      if (err2 || !row) return res.json({ name, email, role });
      res.json(row);
    });
  });
});

// Read-only endpoint to inspect employees (kept minimal)

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
