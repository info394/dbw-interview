const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',      // MySQL host
  user: 'root',           // your MySQL user
  password: 'irish1234',           // your password
  database: 'interview'   // database name
});

module.exports = pool.promise();
