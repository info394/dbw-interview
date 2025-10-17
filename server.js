// server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// -----------------
// 🔹 CLOUD MYSQL CONFIG
const db = mysql.createPool({
  host: process.env.DB_HOST,       // your Render cloud DB host
  user: process.env.DB_USER,       // DB username
  password: process.env.DB_PASS,   // DB password
  database: process.env.DB_NAME,   // DB name
});

// -----------------
// 🔹 ADMIN LOGIN
const ADMIN_USER = "admin";
const ADMIN_PASS = "Petra@2025";

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ success: true, token: "admin-token" });
  } else {
    res.json({ success: false });
  }
});

// -----------------
// 🔹 APPLICANTS CRUD
app.get('/api/applicants', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM applicants');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/applicants', async (req, res) => {
  try {
    const a = req.body;
    if (a.id) {
      await db.query(
        `UPDATE applicants SET name=?, visa=?, nationality=?, salary=?, education=?, contact=?, email=?, time=?, status=?, category=?, year=?, month=?, date=? WHERE id=?`,
        [a.name, a.visa, a.nationality, a.salary, a.education, a.contact, a.email, a.time, a.status, a.category, a.year, a.month, a.date, a.id]
      );
    } else {
      const [result] = await db.query(
        `INSERT INTO applicants (name, visa, nationality, salary, education, contact, email, time, status, category, year, month, date)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [a.name, a.visa, a.nationality, a.salary, a.education, a.contact, a.email, a.time, a.status, a.category, a.year, a.month, a.date]
      );
      a.id = result.insertId;
    }
    res.json({ success: true, id: a.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/applicants/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.query('DELETE FROM applicants WHERE id=?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// -----------------
// 🔹 SERVE FRONTEND
app.use(express.static(path.join(__dirname, 'public')));

// Serve admin.html for login
app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Serve interview.html after login
app.get('/interview.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'interview.html'));
});

// Fallback for any other routes
app.get('*', (req, res) => {
  res.redirect('/admin.html');
});

// -----------------
// 🔹 START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
