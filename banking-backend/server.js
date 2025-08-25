const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3050;

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ DB Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',               // <-- your MySQL user
  password: 'Deepa2405*!',  // <-- your MySQL password
  database: 'interndb'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL');
  }
});

// ✅ Default route
app.get('/', (req, res) => {
  res.send('Banking API Running...');
});

// ✅ 1. Get login details by USER_ID
app.get('/login/by-userid/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT * FROM login WHERE USER_ID = ?';

  db.query(query, [userId], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Database error', detail: err });
    } else if (result.length === 0) {
      res.status(404).json({ message: 'No login data found' });
    } else {
      res.json(result[0]); // full row
    }
  });
});

// ✅ 2. Get assigned customers for an employee
app.get('/employee/:id/customers', (req, res) => {
  const employeeId = req.params.id;

  const query = `
    SELECT cd.* FROM customer_details cd
    INNER JOIN employee_customer_assignment eca ON cd.CUSTOMER_ID = eca.CUSTOMER_ID
    WHERE eca.EMPLOYEE_ID = ?
  `;

  db.query(query, [employeeId], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'DB error', detail: err });
    } else if (result.length === 0) {
      res.status(404).json({ message: 'No assigned customers found' });
    } else {
      res.json(result); // list of full customer_details rows
    }
  });
});

// ✅ 3. Create a bank account (POST)
app.post('/account', (req, res) => {
  const { customer_id, initial_deposit, account_type, ifsc_code, date_of_creation } = req.body;

  const insertQuery = `
    INSERT INTO bankaccount (CUSTOMER_ID, INITIAL_DEPOSIT, ACCOUNT_TYPE, IFSC_CODE, DATE_OF_CREATION)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(insertQuery, [customer_id, initial_deposit, account_type, ifsc_code, date_of_creation], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'DB insert error', detail: err });
    } else {
      const newAccountNo = result.insertId;

      const fetchQuery = 'SELECT * FROM bankaccount WHERE ACCOUNT_NO = ?';
      db.query(fetchQuery, [newAccountNo], (err2, data) => {
        if (err2) {
          res.status(500).json({ error: 'Fetch after insert failed', detail: err2 });
        } else {
          res.json({ message: 'Account created', account: data[0] });
        }
      });
    }
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 API listening at http://localhost:${PORT}`);
});
