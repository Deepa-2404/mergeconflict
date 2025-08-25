// api.js
const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = 3050;

// ✅ MySQL connection config
const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',              // use your actual MySQL user
  password : 'Deepa2405*!',           // your MySQL password
  database : 'bankdb'    // your database name
});

// ✅ Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection failed:', err);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL as id:', db.threadId);
});

// ✅ Query helper to reduce repetition
function query(res, sql, params = []) {
  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error('❌ DB Query Error:', err);
      return res.status(500).json({ error: 'Database error', detail: err });
    }
    res.json(rows);
  });
}

// ✅ Routes

// Get all logins
app.get('/login', (req, res) => {
  query(res, 'SELECT * FROM login');
});

// Get login by username
app.get('/login/by-username/:username', (req, res) => {
  query(res, 'SELECT * FROM login WHERE username = ?', [req.params.username]);
});

// Get username by user ID
app.get('/login/by-userid/:userId', (req, res) => {
  query(res, 'SELECT username FROM login WHERE user_id = ?', [req.params.userId]);
});

// Get all accounts
app.get('/account', (req, res) => {
  query(res, 'SELECT * FROM account');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 API running at: http://localhost:${PORT}`);
});
