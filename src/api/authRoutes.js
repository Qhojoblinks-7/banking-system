// authRoutes.js
import express from "express";
import { supabaseAdmin as supabase } from "../supabaseServiceRole.js";
const router = express.Router();

// User registration endpoint
router.post("/register", async (req, res) => {
  try {
    const { full_name, email, phone_number, date_of_birth, residential_address, account_type, username, password, confirm_password } = req.body;

    console.log("Received registration request body:", req.body); // Log the entire request body

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.toLowerCase().trim();

    console.log("Normalized email:", normalizedEmail);
    console.log("Normalized username:", normalizedUsername);

    // Check if username already exists
    const { data: existingUsername } = await supabase
      .from("user_accounts")
      .select("user_id")
      .eq("username", normalizedUsername)
      .maybeSingle();

    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists." });
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from("user_accounts")
      .select("user_id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({ error: "Email address is already registered." }); // Added error for existing email
    } else {
      // Password confirmation check (optional but recommended)
      if (password !== confirm_password) {
        return res.status(400).json({ error: "Passwords do not match." });
      }

      console.log("Attempting Supabase signup with email:", normalizedEmail);
      console.log("Attempting Supabase signup with username:", normalizedUsername);
      console.log("Supabase signup options data:", {
        full_name,
        phone_number,
        date_of_birth,
        residential_address,
        account_type,
        username: normalizedUsername,
      });

      // Use Supabase auth.signUp for user creation
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
        console.error("Supabase signup error:", authError); // Log the error message
        console.error("Supabase signup error details:", authError); // Log the entire error object
        return res.status(400).json({ error: authError.message });
      }

      res.json({ message: "User registered successfully. Please verify your email.", user: authData?.user });
    }
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Resend OTP endpoint (remains the same)
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const { error } = await supabase.auth.api.sendMagicLinkEmail(email);
    if (error) return res.status(400).json({ error: "Failed to resend OTP." });
    res.json({ message: "OTP resent successfully." });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// User login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log('Received login attempt:', req.body);

  console.log('Backend attempting signin with:', { email, password });
  try {
    console.log('About to call supabase.auth.signInWithPassword');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    console.log('supabase.auth.signInWithPassword result:', { data, error });

    if (error) {
      console.error("Supabase signin error:", error);
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Only send success response if data (user and session) is present
    if (data?.user && data?.session) {
      res.json({ success: true, message: "Logged in successfully", data });
    } else {
      // If no error but no user/session, still treat as invalid credentials
      return res.status(401).json({ error: "Invalid credentials." });
    }

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Refresh token endpoint (replaced with Supabase's built-in session handling)
router.post("/refresh-token", (req, res) => {
  return res.status(400).json({ error: "Refresh token functionality is now handled by Supabase." });
});

export default router;