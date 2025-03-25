import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { supabase } from "../adminSupabaseClient.js";
import { config } from "dotenv";

config({ path: "./.env" });

const router = express.Router();
router.use(express.json());
router.use(cookieParser());

// ==================== Environment Variables ====================
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");

const JWT_EXPIRY = "1h";

// ==================== Generate Token ====================
const generateToken = (admin) =>
  jwt.sign({ user_id: admin.user_id }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

// ==================== Middleware: Authenticate Admin ====================
function authenticateAdmin(req, res, next) {
  let token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

  if (!token) return res.status(401).json({ error: "Unauthorized - Missing token" });

  jwt.verify(token, JWT_SECRET, (err, admin) => {
    if (err) {
      return res.status(403).json({
        error: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
      });
    }
    req.admin = admin;
    next();
  });
}

// ==================== Health Check ====================
router.get("/health", (req, res) => {
  res.json({ status: "Backend is running smoothly 🚀" });
});

// ==================== Admin Registration ====================
router.post("/admin/register", async (req, res) => {
  const { full_name, email, username, password } = req.body; // Added username
  if (!full_name || !email || !username || !password) { // Added username
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const { data: existingEmail } = await supabase
      .from("admin_accounts")
      .select("email")
      .eq("email", email)
      .single();

    if (existingEmail)
      return res.status(400).json({ error: "Email already registered" });

    const { data: existingUsername } = await supabase
      .from("admin_accounts")
      .select("username")
      .eq("username", username)
      .single();

    if (existingUsername)
      return res.status(400).json({ error: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from("admin_accounts")
      .insert([{ full_name, email, username, password_hash: hashedPassword }]) // Added username
      .select()
      .single();
    if (error) throw error;

    const token = generateToken(data);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(201).json({ message: "Admin registered successfully", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/admin/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
  
    try {
      const { data: admin, error } = await supabase
        .from("admin_accounts")
        .select("*")
        .eq("email", email)
        .single();
  
      if (error || !admin) return res.status(401).json({ error: "Invalid credentials" });
  
      const isMatch = await bcrypt.compare(password, admin.password_hash);
      if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
  
      const token = generateToken(admin);
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });
      // Include the admin object in the response:
      res.json({ message: "Login successful", token, user: admin });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// ==================== Get All Users ====================
router.get("/users", authenticateAdmin, async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from("user_accounts")
      .select("*");

    if (error) throw error;

    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== Get All Loans ====================
router.get("/loans", authenticateAdmin, async (req, res) => {
  try {
    const { data: loans, error } = await supabase
      .from("loans")
      .select("*");

    if (error) throw error;

    res.json({ loans });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== Get All Transactions ====================
router.get("/transactions", authenticateAdmin, async (req, res) => {
  try {
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*");

    if (error) throw error;

    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== Get All Cards ====================
router.get("/cards", authenticateAdmin, async (req, res) => {
  try {
    const { data: cards, error } = await supabase
      .from("cards")
      .select("*");

    if (error) throw error;

    res.json({ cards });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== Get All Investments ====================
router.get("/investments", authenticateAdmin, async (req, res) => {
  try {
    const { data: investments, error } = await supabase
      .from("investments")
      .select("*");

    if (error) throw error;

    res.json({ investments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;