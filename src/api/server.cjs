require('dotenv').config({ path: '../.env' });
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.connect((err) => {
  if (err) {
    console.error('❌ Failed to connect to the database:', err);
    process.exit(1);
  } else {
    console.log('✅ Connected to the database');
  }
});

const JWT_SECRET = process.env.JWT_SECRET;

// ---------------------------------------------------------------------
// Middleware: Authenticate Token using JWT
// ---------------------------------------------------------------------
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user; // Contains user_id and email
    next();
  });
}

// ---------------------------------------------------------------------
// Public Endpoints (No Token Required)
// ---------------------------------------------------------------------

// Test connection endpoint
app.get('/api/test-connection', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: '✅ Connection successful', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register new user – triggers create bank account & analytics record automatically
app.post('/api/register', async (req, res) => {
  const {
    full_name,
    email,
    phone_number,
    date_of_birth,
    residential_address,
    account_type,
    username,
    password,
  } = req.body;

  try {
    // Check if a user with the given email or username exists
    const existingUser = await pool.query(
      'SELECT * FROM user_accounts WHERE email = $1 OR username = $2',
      [email, username]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password before storing
    const password_hash = await bcrypt.hash(password, 10);

    // Insert new user; the trigger creates the bank account and analytics record
    const queryText = `
      INSERT INTO user_accounts
      (full_name, email, phone_number, date_of_birth, residential_address, account_type, username, password_hash)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      full_name,
      email,
      phone_number,
      date_of_birth,
      residential_address,
      account_type,
      username,
      password_hash,
    ];
    const result = await pool.query(queryText, values);
    const newUser = result.rows[0];

    res.json({ message: '✅ User registered successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login – returns a JWT token upon successful authentication
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM user_accounts WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------
// Protected Endpoints (Require Valid JWT)
// ---------------------------------------------------------------------
app.use('/api', authenticateToken);

// Get user profile
app.get('/api/user', async (req, res) => {
  try {
    const { user_id } = req.user;
    const result = await pool.query(
      'SELECT * FROM user_accounts WHERE user_id = $1',
      [user_id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'User not found' });
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get bank account balance
app.get('/api/balance', async (req, res) => {
  try {
    const { user_id } = req.user;
    const result = await pool.query(
      'SELECT balance FROM bank_accounts WHERE user_id = $1',
      [user_id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Bank account not found' });
    res.json({ balance: result.rows[0].balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get transactions for the user's bank account
app.get('/api/transactions', async (req, res) => {
  try {
    const { user_id } = req.user;
    const result = await pool.query(
      `SELECT t.* 
       FROM transactions t
       JOIN bank_accounts b ON t.account_id = b.account_id
       WHERE b.user_id = $1
       ORDER BY t.transaction_timestamp DESC`,
      [user_id]
    );
    res.json({ transactions: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new transaction (e.g., deposit or debit)
// Expects: { transaction_type, amount, description }
app.post('/api/transactions', async (req, res) => {
  try {
    const { transaction_type, amount, description } = req.body;
    const { user_id } = req.user;
    // Get user's bank account id
    const accountRes = await pool.query(
      'SELECT account_id FROM bank_accounts WHERE user_id = $1',
      [user_id]
    );
    if (accountRes.rows.length === 0)
      return res.status(404).json({ error: 'Bank account not found' });
    const account_id = accountRes.rows[0].account_id;

    const queryText = `
      INSERT INTO transactions (account_id, transaction_type, amount, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(queryText, [
      account_id,
      transaction_type,
      amount,
      description,
    ]);
    res.json({ message: '✅ Transaction added successfully', transaction: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit a loan request
// Expects: { loan_amount, interest_rate }
app.post('/api/loans', async (req, res) => {
  try {
    const { loan_amount, interest_rate } = req.body;
    const status = 'pending'; // default status
    const { user_id } = req.user;
    const queryText = `
      INSERT INTO loans (user_id, loan_amount, interest_rate, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(queryText, [user_id, loan_amount, interest_rate, status]);
    res.json({ message: '✅ Loan request submitted', loan: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve loans for the logged-in user
app.get('/api/loans', async (req, res) => {
  try {
    const { user_id } = req.user;
    const result = await pool.query(
      'SELECT * FROM loans WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    res.json({ loans: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Initiate a transfer between accounts
// Expects: { to_account, amount, description }
// The sender's account is determined by the authenticated user.
app.post('/api/transfers', async (req, res) => {
  try {
    const { to_account, amount, description } = req.body;
    const { user_id } = req.user;
    // Get sender's bank account id
    const accountRes = await pool.query(
      'SELECT account_id FROM bank_accounts WHERE user_id = $1',
      [user_id]
    );
    if (accountRes.rows.length === 0)
      return res.status(404).json({ error: 'Sender bank account not found' });
    const from_account = accountRes.rows[0].account_id;

    const queryText = `
      INSERT INTO transfers (from_account, to_account, amount, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(queryText, [from_account, to_account, amount, description]);
    res.json({ message: '✅ Transfer initiated', transfer: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get expenditures for the user's bank account
app.get('/api/expenditures', async (req, res) => {
  try {
    const { user_id } = req.user;
    const accountRes = await pool.query(
      'SELECT account_id FROM bank_accounts WHERE user_id = $1',
      [user_id]
    );
    if (accountRes.rows.length === 0)
      return res.status(404).json({ error: 'Bank account not found' });
    const account_id = accountRes.rows[0].account_id;
    const result = await pool.query(
      'SELECT * FROM expenditures WHERE account_id = $1 ORDER BY expenditure_timestamp DESC',
      [account_id]
    );
    res.json({ expenditures: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new expenditure record
// Expects: { category, amount, description }
app.post('/api/expenditures', async (req, res) => {
  try {
    const { category, amount, description } = req.body;
    const { user_id } = req.user;
    const accountRes = await pool.query(
      'SELECT account_id FROM bank_accounts WHERE user_id = $1',
      [user_id]
    );
    if (accountRes.rows.length === 0)
      return res.status(404).json({ error: 'Bank account not found' });
    const account_id = accountRes.rows[0].account_id;

    const queryText = `
      INSERT INTO expenditures (account_id, category, amount, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(queryText, [account_id, category, amount, description]);
    res.json({ message: '✅ Expenditure added', expenditure: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get investments for the logged-in user
app.get('/api/investments', async (req, res) => {
  try {
    const { user_id } = req.user;
    const result = await pool.query(
      'SELECT * FROM investments WHERE user_id = $1 ORDER BY purchase_date DESC',
      [user_id]
    );
    res.json({ investments: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new investment record
// Expects: { asset_type, asset_name, quantity, purchase_price, (optional) current_price, (optional) status }
app.post('/api/investments', async (req, res) => {
  try {
    const { asset_type, asset_name, quantity, purchase_price, current_price, status } = req.body;
    const { user_id } = req.user;
    // Get user's bank account id for investments record
    const accountRes = await pool.query(
      'SELECT account_id FROM bank_accounts WHERE user_id = $1',
      [user_id]
    );
    if (accountRes.rows.length === 0)
      return res.status(404).json({ error: 'Bank account not found' });
    const account_id = accountRes.rows[0].account_id;

    const investStatus = status || 'active';
    const investCurrentPrice = current_price || purchase_price;
    const queryText = `
      INSERT INTO investments (user_id, account_id, asset_type, asset_name, quantity, purchase_price, current_price, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const result = await pool.query(queryText, [
      user_id,
      account_id,
      asset_type,
      asset_name,
      quantity,
      purchase_price,
      investCurrentPrice,
      investStatus,
    ]);
    res.json({ message: '✅ Investment added', investment: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get analytics data for the user
app.get('/api/analytics', async (req, res) => {
  try {
    const { user_id } = req.user;
    const result = await pool.query('SELECT * FROM analytics WHERE user_id = $1', [user_id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Analytics data not found' });
    res.json({ analytics: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------
// Start the API Server
// ---------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API server running on port ${PORT}`));
