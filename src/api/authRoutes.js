import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabaseAdmin as supabase } from "../supabaseServiceRole.js";

const router = express.Router();

// User registration
router.post("/register", async (req, res) => {
  try {
    const { full_name, email, phone_number, date_of_birth, residential_address, account_type, username, password, confirm_password } = req.body;

    if (password !== confirm_password) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.toLowerCase().trim();

    // Check if email or username already exists
    const { data: existingUser } = await supabase
      .from("user_accounts")
      .select("user_id")
      .or(`email.eq.${normalizedEmail},username.eq.${normalizedUsername}`)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({ error: "Email or username already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Register user in Supabase Authentication
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Store user in `user_accounts` table
    const { data: newUser, error: dbError } = await supabase
      .from("user_accounts")
      .insert([
        {
          user_id: authUser.user.id,
          full_name,
          email: normalizedEmail,
          phone_number,
          date_of_birth,
          residential_address,
          account_type,
          username: normalizedUsername,
          password_hash: hashedPassword
        }
      ])
      .select()
      .single();

    if (dbError) {
      return res.status(500).json({ error: dbError.message });
    }

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const { data: user, error } = await supabase
      .from("user_accounts")
      .select("*")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (!user || error) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
