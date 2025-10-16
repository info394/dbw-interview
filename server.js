// server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createPool({
  host: 'localhost', // Change later if deploying online
  user: 'root',
  password: 'irish1234',
  database: 'interview_system'
});

// Get all applicants
app.get('/api/applicants', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM applicants');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add or update applicant
app.post('/api/applicants', async (req, res) => {
  try {
    const a = req.body;
    if (a.id) {
      // update
      await db.query(
        'UPDATE applicants SET name=?, visa=?, nationality=?, salary=?, education=?, contact=?, email=?, time=?, status=?, category=?, year=?, month=?, date=? WHERE id=?',
        [a.name, a.visa, a.nationality, a.salary, a.education, a.contact, a.email, a.time, a.status, a.category, a.year, a.month, a.date, a.id]
      );
    } else {
      // insert
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

// Delete applicant
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

// ✅ Use Render-compatible port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('✅ Backend is running successfully!');
});

