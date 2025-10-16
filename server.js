// server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const http = require('http');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'irish1234',
  database: 'interview_system'
});

// Get all applicants
app.get('/api/applicants', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM applicants');
  res.json(rows);
});

// Add or update applicant
app.post('/api/applicants', async (req, res) => {
  const a = req.body;
  if(a.id){ // update
    await db.query(
      'UPDATE applicants SET name=?, visa=?, nationality=?, salary=?, education=?, contact=?, email=?, time=?, status=?, category=?, year=?, month=?, date=? WHERE id=?',
      [a.name,a.visa,a.nationality,a.salary,a.education,a.contact,a.email,a.time,a.status,a.category,a.year,a.month,a.date,a.id]
    );
  } else { // insert
    const [result] = await db.query(
      'INSERT INTO applicants (name,visa,nationality,salary,education,contact,email,time,status,category,year,month,date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [a.name,a.visa,a.nationality,a.salary,a.education,a.contact,a.email,a.time,a.status,a.category,a.year,a.month,a.date]
    );
    a.id = result.insertId;
  }

  io.emit('update', a); // broadcast to all clients
  res.json({success:true, id:a.id});
});

// Delete applicant
app.delete('/api/applicants/:id', async (req, res) => {
  const id = req.params.id;
  await db.query('DELETE FROM applicants WHERE id=?', [id]);
  io.emit('delete', id); // broadcast deletion
  res.json({success:true});
});

server.listen(3000, () => console.log('Server running on port 3000'));
