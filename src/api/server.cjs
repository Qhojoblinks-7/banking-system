require('dotenv').config({ path: '../.env' });
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const supabase = require('./supabaseClient');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.connect((err) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
  } else {
    console.log('Connected to the database');
  }
});

const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Test database connection
app.get('/api/test-connection', async (req, res) => {
  try {
    const { data, error } = await supabase.from('user_accounts').select('*').limit(1);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Connection successful', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register new user & auto-create related accounts
app.post('/api/register', async (req, res) => {
  try {
    const { full_name, email, phone_number, date_of_birth, residential_address, account_type, username, password } = req.body;
    
    // Check if user already exists
    const { data: existingUser, error: userCheckError } = await supabase
      .from('user_accounts')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const password_hash = await bcrypt.hash(password, 10);

    // Insert user into user_accounts table
    const { data: newUser, error: userError } = await supabase
      .from('user_accounts')
      .insert([{ full_name, email, phone_number, date_of_birth, residential_address, account_type, username, password_hash }])
      .select()
      .single();

    if (userError) return res.status(400).json({ error: userError.message });

    // Auto-create a bank account for the user
    const { data: bankAccount, error: bankError } = await supabase
      .from('bank_accounts')
      .insert([{ user_id: newUser.user_id, account_type, balance: 0 }])
      .single();

    if (bankError) return res.status(400).json({ error: bankError.message });

    res.json({ message: 'User registered successfully', user: newUser, bank_account: bankAccount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const { data: user, error } = await supabase
      .from('user_accounts')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !user) return res.status(400).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ user_id: user.user_id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api', authenticateToken);

// Get user details
app.get('/api/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: user, error } = await supabase
      .from('user_accounts')
      .select('*')
      .eq('user_id', id)
      .single();

    if (error) return res.status(400).json({ error: 'User not found' });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user balance
app.get('/api/balance', async (req, res) => {
  try {
    const { user_id } = req.user;

    const { data, error } = await supabase
      .from('bank_accounts')
      .select('balance')
      .eq('user_id', user_id)
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.json({ balance: data.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Transfer funds between accounts
app.post('/api/transfer', async (req, res) => {
  try {
    const { from_account, to_account, amount, description } = req.body;

    const { data, error } = await supabase.rpc('transfer_funds', {
      p_from_account: from_account,
      p_to_account: to_account,
      p_amount: amount,
      p_description: description,
    });

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: 'Transfer successful', transaction: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create investment
app.post('/api/investments', async (req, res) => {
  try {
    const { user_id, amount, investment_type, duration } = req.body;

    if (amount <= 0) return res.status(400).json({ error: 'Amount must be greater than zero' });

    const { data, error } = await supabase
      .from('investments')
      .insert([{ user_id, amount, investment_type, duration, status: 'active' }])
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: 'Investment created', investment: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Withdraw investment
app.post('/api/investments/withdraw', async (req, res) => {
  try {
    const { investment_id, user_id, amount } = req.body;

    const { data: investment, error } = await supabase
      .from('investments')
      .select('*')
      .eq('investment_id', investment_id)
      .eq('user_id', user_id)
      .single();

    if (error || !investment) return res.status(400).json({ error: 'Investment not found' });

    if (investment.amount < amount) return res.status(400).json({ error: 'Insufficient investment balance' });

    const newAmount = investment.amount - amount;

    await supabase.from('investments').update({ amount: newAmount }).eq('investment_id', investment_id);

    res.json({ message: 'Withdrawal successful', remaining_balance: newAmount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins (change to specific domain if needed)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API server is running on port ${PORT}`));
