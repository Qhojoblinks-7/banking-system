import { config } from "dotenv";
config({ path: "../../.env" });
import cors from "cors";
import express from "express";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../supabaseClient.js"; // Correct import path
import { fileURLToPath } from "url";

// Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Load environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Check if environment variables are loaded
if (!JWT_SECRET) {
  throw new Error("Missing required environment variables");
}

// Dummy Exchange Rates Endpoint
app.get("/api/exchange-rates", (req, res) => {
  res.json({
    trends: [
      { date: "2023-01-01", rate: 1.2 },
      { date: "2023-02-01", rate: 1.3 },
      { date: "2023-03-01", rate: 1.15 },
    ],
  });
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["PUT", "DELETE", "GET", "POST"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
    ],
    credentials: true,
  })
);

// JWT Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user; // Contains user_id and email
    next();
  });
}

// Public Endpoints

// Test connection using the "user_accounts" table
app.get("/api/test-connection", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("user_accounts")
      .select("*")
      .limit(1);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "✅ Connection successful", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register user and create bank account
app.post("/api/register", async (req, res) => {
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

    // Check if user already exists
    const { data: existingUser, error: existingUserError } = await supabase
      .from("user_accounts")
      .select("email")
      .eq("email", email)
      .single();
    if (existingUserError) {
      console.error("Error checking existing user:", existingUserError);
      return res.status(500).json({ error: existingUserError.message });
    }
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert new user into user_accounts table
    const { data: newUser, error: userError } = await supabase
      .from("user_accounts")
      .insert([
        {
          full_name,
          email,
          phone_number,
          date_of_birth,
          residential_address,
          account_type,
          username,
          password_hash,
        },
      ])
      .select()
      .single();
    if (userError) {
      console.error("Error inserting new user:", userError);
      return res.status(500).json({ error: userError.message });
    }

    // Generate an account number in your desired format.
    const account_number =
      "BNS" + Math.floor(1000000000 + Math.random() * 9000000000);

    // Create bank account in bank_accounts table
    const { data: bankAccount, error: bankError } = await supabase
      .from("bank_accounts")
      .insert([
        {
          user_id: newUser.user_id,
          account_type,
          balance: 0,
          account_number,
        },
      ])
      .select()
      .single();
    if (bankError) {
      console.error("Error creating bank account:", bankError);
      return res.status(500).json({ error: bankError.message });
    }

    // Send OTP to user's email via Supabase Magic Link
    const { error: otpError } = await supabase.auth.api.sendMagicLinkEmail(
      email
    );
    if (otpError) {
      console.error("Error sending OTP:", otpError);
      return res.status(500).json({ error: otpError.message });
    }

    res.json({
      message: "✅ User registered successfully. Please verify your email.",
      user: newUser,
      bank_account: bankAccount,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Verify OTP
app.post("/api/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "✅ OTP verified successfully", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Resend OTP
app.post("/api/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const { error } = await supabase.auth.api.sendMagicLinkEmail(email);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "✅ OTP resent successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: user, error } = await supabase
      .from("user_accounts")
      .select("*")
      .eq("email", email)
      .single();
    if (error || !user)
      return res.status(400).json({ error: "Invalid email or password" });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(400).json({ error: "Invalid email or password" });
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    if (token) {
      res.cookie("token", token, { httpOnly: true, secure: false }).json({
        success: true,
        message: "Logged in successfully",
        data: {
          user_id: user.user_id,
          email: user.email,
        },
      });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// ---------------------------------------------------------------------
// Protected Endpoints (require valid JWT)
// ---------------------------------------------------------------------
app.use("/api", authenticateToken);

// Get user details (merges user_accounts with bank account's account_number)
app.get("/api/user", async (req, res) => {
  try {
    const { user_id } = req.user;
    const { data: user, error } = await supabase
      .from("user_accounts")
      .select("*")
      .eq("user_id", user_id)
      .single();
    if (error) return res.status(400).json({ error: error.message });
    // Retrieve bank account's account_number
    const { data: bankAccount, error: bankError } = await supabase
      .from("bank_accounts")
      .select("account_number")
      .eq("user_id", user_id)
      .single();
    if (bankError) return res.status(400).json({ error: bankError.message });
    res.json({ user, account_number: bankAccount.account_number });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get balance and account number
app.get("/api/balance", async (req, res) => {
  try {
    const { user_id } = req.user;
    const { data, error } = await supabase
      .from("bank_accounts")
      .select("balance, account_number")
      .eq("user_id", user_id)
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ balance: data.balance, account_number: data.account_number });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Securely add card (hash card number & CVV)
app.post("/api/cards", async (req, res) => {
  try {
    const { user_id, card_number, cvv, expiry_date, card_type, card_provider } =
      req.body;
    const hashedCardNumber = await bcrypt.hash(card_number, 10);
    const hashedCvv = await bcrypt.hash(cvv, 10);
    const lastFourDigits = card_number.slice(-4);
    const { data, error } = await supabase
      .from("cards")
      .insert([
        {
          user_id,
          hashed_card_number: hashedCardNumber,
          last_four_digits: lastFourDigits,
          hashed_cvv: hashedCvv,
          expiry_date,
          card_type,
          card_provider,
          card_status: "active",
        },
      ])
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({
      message: "✅ Card added successfully",
      card: { last_four_digits: data.last_four_digits, expiry_date },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's cards
app.get("/api/cards", async (req, res) => {
  try {
    const { user_id } = req.user;
    const { data, error } = await supabase
      .from("cards")
      .select("last_four_digits, expiry_date, card_type, card_provider")
      .eq("user_id", user_id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ cards: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify card number (hash comparison)
app.post("/api/cards/verify", async (req, res) => {
  try {
    const { user_id, card_number } = req.body;
    const { data, error } = await supabase
      .from("cards")
      .select("hashed_card_number")
      .eq("user_id", user_id)
      .single();
    if (error) return res.status(400).json({ error: "Card not found" });
    const match = await bcrypt.compare(card_number, data.hashed_card_number);
    res.json({ verified: match });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get transactions
app.get("/api/transactions", async (req, res) => {
  try {
    const { user_id } = req.user;
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user_id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ transactions: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create transaction (deposit or debit)
app.post("/api/transactions", async (req, res) => {
  try {
    const { transaction_type, amount, description } = req.body;
    const { user_id } = req.user;
    // Get user's bank account ID
    const { data: accountData, error: accountError } = await supabase
      .from("bank_accounts")
      .select("account_id")
      .eq("user_id", user_id)
      .single();
    if (accountError)
      return res.status(404).json({ error: "Bank account not found" });
    const account_id = accountData.account_id;
    const { data, error } = await supabase
      .from("transactions")
      .insert([{ account_id, transaction_type, amount, description }])
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({
      message: "✅ Transaction added successfully",
      transaction: data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit loan request
app.post("/api/loans", async (req, res) => {
  try {
    const { loan_amount, interest_rate } = req.body;
    const status = "pending";
    const { user_id } = req.user;
    const { data, error } = await supabase
      .from("loans")
      .insert([{ user_id, loan_amount, interest_rate, status }])
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "✅ Loan request submitted", loan: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve loans
app.get("/api/loans", async (req, res) => {
  try {
    const { user_id } = req.user;
    const { data, error } = await supabase
      .from("loans")
      .select("*")
      .eq("user_id", user_id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ loans: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Initiate transfer
app.post("/api/transfers", async (req, res) => {
  try {
    const { to_account, amount, description } = req.body;
    const { user_id } = req.user;
    // Get sender's bank account ID
    const { data: accountData, error: accountError } = await supabase
      .from("bank_accounts")
      .select("account_id")
      .eq("user_id", user_id)
      .single();
    if (accountError)
      return res.status(404).json({ error: "Sender bank account not found" });
    const from_account = accountData.account_id;
    const { data, error } = await supabase
      .from("transfers")
      .insert([{ from_account, to_account, amount, description }])
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "✅ Transfer initiated", transfer: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get expenditures
app.get("/api/expenditures", async (req, res) => {
  try {
    const { user_id } = req.user;
    // First, get user's bank account ID
    const { data: accountData, error: accountError } = await supabase
      .from("bank_accounts")
      .select("account_id")
      .eq("user_id", user_id)
      .single();
    if (accountError)
      return res.status(404).json({ error: "Bank account not found" });
    const account_id = accountData.account_id;
    const { data, error } = await supabase
      .from("expenditures")
      .select("*")
      .eq("account_id", account_id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ expenditures: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add expenditure
app.post("/api/expenditures", async (req, res) => {
  try {
    const { category, amount, description } = req.body;
    const { user_id } = req.user;
    // Get user's bank account ID
    const { data: accountData, error: accountError } = await supabase
      .from("bank_accounts")
      .select("account_id")
      .eq("user_id", user_id)
      .single();
    if (accountError)
      return res.status(404).json({ error: "Bank account not found" });
    const account_id = accountData.account_id;
    const { data, error } = await supabase
      .from("expenditures")
      .insert([{ account_id, category, amount, description }])
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "✅ Expenditure added", expenditure: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get investments
app.get("/api/investments", async (req, res) => {
  try {
    const { user_id } = req.user;
    const { data, error } = await supabase
      .from("investments")
      .select("*")
      .eq("user_id", user_id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ investments: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add investment
app.post("/api/investments", async (req, res) => {
  try {
    const {
      asset_type,
      asset_name,
      quantity,
      purchase_price,
      current_price,
      status,
    } = req.body;
    const { user_id } = req.user;
    // Get user's bank account ID
    const { data: accountData, error: accountError } = await supabase
      .from("bank_accounts")
      .select("account_id")
      .eq("user_id", user_id)
      .single();
    if (accountError)
      return res.status(404).json({ error: "Bank account not found" });
    const account_id = accountData.account_id;
    const investStatus = status || "active";
    const investCurrentPrice = current_price || purchase_price;
    const { data, error } = await supabase
      .from("investments")
      .insert([
        {
          user_id,
          account_id,
          asset_type,
          asset_name,
          quantity,
          purchase_price,
          current_price: investCurrentPrice,
          status: investStatus,
        },
      ])
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "✅ Investment added", investment: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get analytics
app.get("/api/analytics", async (req, res) => {
  try {
    const { user_id } = req.user;
    const { data, error } = await supabase
      .from("analytics")
      .select("*")
      .eq("user_id", user_id)
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ analytics: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Withdrawal Endpoint
app.post("/api/withdraw", async (req, res) => {
  try {
    const { account_number, amount, method, scheduled_date } = req.body;
    const { user_id } = req.user;
    // Retrieve user's bank account by user_id and account_number
    const { data: accountData, error: accountError } = await supabase
      .from("bank_accounts")
      .select("*")
      .eq("user_id", user_id)
      .eq("account_number", account_number)
      .single();
    if (!accountData) {
      return res
        .status(404)
        .json({ error: "Bank account not found or does not belong to user" });
    }
    const account = accountData;
    if (amount <= 0 || amount > account.balance) {
      return res.status(400).json({ error: "Invalid withdrawal amount" });
    }
    const newBalance = account.balance - amount;
    // Update bank account balance
    const { error: updateError } = await supabase
      .from("bank_accounts")
      .update({ balance: newBalance })
      .eq("account_id", account.account_id);
    if (updateError)
      return res.status(400).json({ error: updateError.message });
    const description =
      `Withdrawal via ${method}` +
      (scheduled_date ? ` scheduled on ${scheduled_date}` : "");
    // Record the withdrawal as a transaction
    const { data: withdrawalData, error: txError } = await supabase
      .from("transactions")
      .insert([
        {
          account_id: account.account_id,
          transaction_type: "withdrawal",
          amount,
          description,
        },
      ])
      .single();
    if (txError) return res.status(400).json({ error: txError.message });
    res.json({
      message: "✅ Withdrawal processed successfully",
      withdrawal: withdrawalData,
    });
  } catch (err) {
    console.error("Withdrawal error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API server running on port ${PORT}`));
