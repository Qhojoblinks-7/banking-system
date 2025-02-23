// server.mjs
import { fileURLToPath } from 'url';
import path from 'path';
import { config } from 'dotenv';
config({ path: '../../.env' }); // Ensure your .env file is two levels up
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../supabaseClient.js'; // Supabase client uses SUPABASE_URL and SUPABASE_ANON_KEY

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const JWT_SECRET = process.env.JWT_SECRET;

// 🔐 Authenticate Token Middleware
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

// 📌 Test connection endpoint using Supabase
app.get('/api/test-connection', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_accounts')
      .select('*')
      .limit(1);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: '✅ Connection successful', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Register user & create bank account
app.post('/api/register', async (req, res) => {
  try {
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

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('user_accounts')
      .select('email')
      .eq('email', email)
      .single();
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const password_hash = await bcrypt.hash(password, 10);

    const { data: newUser, error: userError } = await supabase
      .from('user_accounts')
      .insert([
        { full_name, email, phone_number, date_of_birth, residential_address, account_type, username, password_hash },
      ])
      .select()
      .single();
    if (userError) return res.status(400).json({ error: userError.message });

    const { data: bankAccount, error: bankError } = await supabase
      .from('bank_accounts')
      .insert([{ user_id: newUser.user_id, account_type, balance: 0 }])
      .single();
    if (bankError) return res.status(400).json({ error: bankError.message });

    // Send OTP (magic link) to user's email
    const { error: otpError } = await supabase.auth.api.sendMagicLinkEmail(email);
    if (otpError) return res.status(400).json({ error: otpError.message });

    res.json({
      message: '✅ User registered successfully. Please verify your email.',
      user: newUser,
      bank_account: bankAccount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Verify OTP
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: '✅ OTP verified successfully', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Resend OTP
app.post('/api/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const { error: otpError } = await supabase.auth.api.sendMagicLinkEmail(email);
    if (otpError) return res.status(400).json({ error: otpError.message });
    res.json({ message: '✅ OTP resent successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 User login
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

// Apply authentication middleware to the endpoints below
app.use('/api', authenticateToken);

// 📌 Get user details
app.get('/api/user', async (req, res) => {
  try {
    const { user_id } = req.user;
    const { data: user, error } = await supabase
      .from('user_accounts')
      .select('*')
      .eq('user_id', user_id)
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Get balance
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

// 📌 Securely Add Card (Hashed Card Number & CVV)
app.post('/api/cards', async (req, res) => {
  try {
    const { user_id, card_number, cvv, expiry_date, card_type, card_provider } = req.body;
    const hashedCardNumber = await bcrypt.hash(card_number, 10);
    const hashedCvv = await bcrypt.hash(cvv, 10);
    const lastFourDigits = card_number.slice(-4);
    const { data, error } = await supabase.from('cards').insert([
      { user_id, hashed_card_number: hashedCardNumber, last_four_digits: lastFourDigits, hashed_cvv: hashedCvv, expiry_date, card_type, card_provider, card_status: 'active' }
    ]).single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: '✅ Card added successfully', card: { last_four_digits: data.last_four_digits, expiry_date } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Get User's Cards
app.get('/api/cards', async (req, res) => {
  try {
    const { user_id } = req.user;
    const { data, error } = await supabase.from('cards').select('last_four_digits, expiry_date, card_type, card_provider').eq('user_id', user_id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ cards: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Verify Card Number (One-Way Hash Comparison)
app.post('/api/cards/verify', async (req, res) => {
  try {
    const { user_id, card_number } = req.body;
    const { data, error } = await supabase.from('cards').select('hashed_card_number').eq('user_id', user_id).single();
    if (error) return res.status(400).json({ error: 'Card not found' });
    const match = await bcrypt.compare(card_number, data.hashed_card_number);
    res.json({ verified: match });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Create Withdrawal Endpoint
app.post('/api/withdraw', async (req, res) => {
  try {
    const { account_number, amount, method, scheduled_date } = req.body;
    const { user_id } = req.user;
    const { data: account, error: accountError } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('user_id', user_id)
      .eq('account_number', account_number)
      .single();
    if (accountError || !account) {
      return res.status(404).json({ error: 'Bank account not found or does not belong to user' });
    }
    if (amount <= 0 || amount > account.balance) {
      return res.status(400).json({ error: 'Invalid withdrawal amount' });
    }
    const newBalance = account.balance - amount;
    const { error: updateError } = await supabase
      .from('bank_accounts')
      .update({ balance: newBalance })
      .eq('account_id', account.account_id);
    if (updateError) return res.status(400).json({ error: updateError.message });
    const description = `Withdrawal via ${method}` + (scheduled_date ? ` scheduled on ${scheduled_date}` : '');
    const { data: withdrawalData, error: txError } = await supabase
      .from('transactions')
      .insert([{ account_id: account.account_id, transaction_type: 'withdrawal', amount, description }])
      .single();
    if (txError) return res.status(400).json({ error: txError.message });
    res.json({ message: '✅ Withdrawal processed successfully', withdrawal: withdrawalData });
  } catch (err) {
    console.error('Withdrawal error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API server running on port ${PORT}`));
