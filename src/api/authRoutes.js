import express from "express";
import { supabaseAdmin as supabase } from "../supabaseServiceRole.js";

const router = express.Router();

// User registration endpoint
router.post("/register", async (req, res) => {
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
      confirm_password,
    } = req.body;

    console.log("Received registration request body:", req.body);

    if (!email || !username || !password || !confirm_password) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.toLowerCase().trim();

    console.log("Normalized email:", normalizedEmail);
    console.log("Normalized username:", normalizedUsername);

    // Check if username already exists
    const { data: existingUsername, error: usernameError } = await supabase
      .from("user_accounts")
      .select("user_id")
      .eq("username", normalizedUsername)
      .maybeSingle();

    if (usernameError) {
      console.error("Error checking username:", usernameError);
      return res.status(500).json({ error: "Database error while checking username." });
    }

    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists." });
    }

    // Check if email already exists
    const { data: existingUser, error: emailError } = await supabase
      .from("user_accounts")
      .select("user_id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (emailError) {
      console.error("Error checking email:", emailError);
      return res.status(500).json({ error: "Database error while checking email." });
    }

    if (existingUser) {
      return res.status(400).json({ error: "Email address is already registered." });
    }

    // Check if passwords match
    if (password !== confirm_password) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    console.log("Attempting Supabase signup...");

    // Supabase auth signup
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: password,
      options: {
        data: {
          full_name,
          phone_number,
          date_of_birth,
          residential_address,
          account_type,
          username: normalizedUsername,
        },
      },
    });

    if (authError) {
      console.error("Supabase signup error:", authError);
      return res.status(400).json({ error: authError.message });
    }

    res.json({ message: "User registered successfully. Please verify your email.", user: authData?.user });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Resend OTP endpoint (using signInWithOtp instead of deprecated method)
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      console.error("OTP resend error:", error);
      return res.status(400).json({ error: "Failed to resend OTP." });
    }

    res.json({ message: "OTP resent successfully." });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// User login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    console.log("Received login attempt:", { email });

    const normalizedEmail = email.toLowerCase().trim();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: password,
    });

    if (error) {
      console.error("Supabase login error:", error);
      return res.status(401).json({ error: "Invalid credentials." });
    }

    if (data?.user && data?.session) {
      res.json({ success: true, message: "Logged in successfully", data });
    } else {
      return res.status(401).json({ error: "Invalid credentials." });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Refresh token endpoint (now managed by Supabase)
router.post("/refresh-token", (req, res) => {
  return res.status(400).json({ error: "Refresh token functionality is handled by Supabase." });
});

export default router;
