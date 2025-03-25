// loanRoutes.js
import express from "express";
import { supabase } from "../adminSupabaseClient.js";
import { authenticateToken } from "./middleware/authMiddleware.js"; // Assuming you have this middleware

const router = express.Router();

// Submit a loan request
router.post("/", authenticateToken, async (req, res) => {
  console.log("Incoming request: POST /api/loans");
  console.log("Authenticated user:", req.user);
  console.log("Request Body:", req.body);
  try {
    const { loan_amount, interest_rate } = req.body;
    const status = "pending";
    const { user_id } = req.user;
    console.log("Submitting loan request for user_id:", user_id);

    const loanInsertQuery = supabase
      .from("loans")
      .insert([{ user_id, loan_amount, interest_rate, status }])
      .single();
    console.log("Loan Insert Query:", loanInsertQuery.toString());
    const { data, error } = await loanInsertQuery;
    console.log("Loan Insert Query Result:", { data, error });

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "✅ Loan request submitted", loan: data });
  } catch (err) {
    console.error("Error in /api/loans:", err);
    console.error("Full error object:", err);
    res.status(500).json({ error: err.message });
  }
});

// Retrieve loans for the authenticated user
router.get("/", authenticateToken, async (req, res) => {
  console.log("Incoming request: GET /api/loans");
  console.log("Authenticated user:", req.user);
  try {
    const { user_id } = req.user;
    console.log("Fetching loans for user_id:", user_id);

    const loansQuery = supabase
      .from("loans")
      .select("*")
      .eq("user_id", user_id);
    console.log("Loans Query:", loansQuery.toString());
    const { data, error } = await loansQuery;
    console.log("Loans Query Result:", { data, error });

    if (error) return res.status(400).json({ error: error.message });
    res.json({ loans: data });
  } catch (err) {
    console.error("Error in /api/loans:", err);
    console.error("Full error object:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;