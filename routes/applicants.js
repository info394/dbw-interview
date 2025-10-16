const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all applicants
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM applicants');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new applicant
router.post('/', async (req, res) => {
  try {
    const applicant = req.body;
    const [result] = await db.query(
      `INSERT INTO applicants 
      (category, year, month, date, name, visa, nationality, salary, education, contact, email, attested, time, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        applicant.category,
        applicant.year,
        applicant.month,
        applicant.date,
        applicant.name,
        applicant.visa,
        applicant.nationality,
        applicant.salary,
        applicant.education,
        applicant.contact,
        applicant.email,
        applicant.attested,
        applicant.time,
        applicant.status
      ]
    );
    res.json({ id: result.insertId, ...applicant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update applicant
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const applicant = req.body;
    await db.query(
      `UPDATE applicants SET category=?, year=?, month=?, date=?, name=?, visa=?, nationality=?, salary=?, education=?, contact=?, email=?, attested=?, time=?, status=? WHERE id=?`,
      [
        applicant.category,
        applicant.year,
        applicant.month,
        applicant.date,
        applicant.name,
        applicant.visa,
        applicant.nationality,
        applicant.salary,
        applicant.education,
        applicant.contact,
        applicant.email,
        applicant.attested,
        applicant.time,
        applicant.status,
        id
      ]
    );
    res.json({ id, ...applicant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete applicant
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.query('DELETE FROM applicants WHERE id=?', [id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
