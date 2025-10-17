// server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'irish1234',
  database: 'interview_system'
});

// Dummy admin credentials (you can replace with DB login later)
const ADMIN_USER = "admin";
const ADMIN_PASS = "Petra@2025";

// ✅ LOGIN ROUTE
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ success: true, token: "admin-token" });
  } else {
    res.json({ success: false });
  }
});

// ✅ GET ALL APPLICANTS
app.get('/api/applicants', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM applicants');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ ADD OR UPDATE APPLICANT
app.post('/api/applicants', async (req, res) => {
  try {
    const a = req.body;
    if (a.id) {
      await db.query(
        'UPDATE applicants SET name=?, visa=?, nationality=?, salary=?, education=?, contact=?, email=?, time=?, status=?, category=?, year=?, month=?, date=? WHERE id=?',
        [a.name, a.visa, a.nationality, a.salary, a.education, a.contact, a.email, a.time, a.status, a.category, a.year, a.month, a.date, a.id]
      );
    } else {
      const [result] = await db.query(
        'INSERT INTO applicants (name, visa, nationality, salary, education, contact, email, time, status, category, year, month, date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
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

// ✅ DELETE APPLICANT
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

// ✅ SERVE FRONTEND FILES (from /public)
app.use(express.static(path.join(__dirname, 'public')));

// Default route (for browser)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Fallback for unmatched routes (so it doesn’t show “Not Found”)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ✅ START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
