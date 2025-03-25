// expenditureRoutes.js
import express from "express";
import { supabase } from "../adminSupabaseClient.js";
import { authenticateToken } from "./middleware/authMiddleware.js"; // Assuming you have this middleware

const router = express.Router();

// Retrieve expenditures for the authenticated user
router.get("/", authenticateToken, async (req, res) => {
  console.log("Incoming request: GET /api/expenditures");
  console.log("Authenticated user:", req.user);
  try {
    const { user_id } = req.user;
    console.log("Fetching expenditures for user_id:", user_id);

    const accountDataQuery = supabase
      .from("bank_accounts")
      .select("account_id")
      .eq("user_id", user_id)
      .single();
    console.log("Bank Account Query:", accountDataQuery.toString());
    const { data: accountData, error: accountError } = await accountDataQuery;
    console.log("Bank Account Query Result:", { data: accountData, error: accountError });

    if (accountError)
      return res.status(404).json({ error: "Bank account not found" });

    const account_id = accountData.account_id;
    console.log("Account ID:", account_id);

    const expendituresQuery = supabase
      .from("expenditures")
      .select("*")
      .eq("account_id", account_id);
    console.log("Expenditures Query:", expendituresQuery.toString());
    const { data, error } = await expendituresQuery;
    console.log("Expenditures Query Result:", { data, error });

    if (error) return res.status(400).json({ error: error.message });
    res.json({ expenditures: data });
  } catch (err) {
    console.error("Error in /api/expenditures:", err);
    console.error("Full error object:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add an expenditure
router.post("/", authenticateToken, async (req, res) => {
  console.log("Incoming request: POST /api/expenditures");
  console.log("Authenticated user:", req.user);
  console.log("Request Body:", req.body);
  try {
    const { category, amount, description } = req.body;
    const { user_id } = req.user;
    console.log("Adding expenditure for user_id:", user_id, "category:", category, "amount:", amount);

    const accountDataQuery = supabase
      .from("bank_accounts")
      .select("account_id")
      .eq("user_id", user_id)
      .single();
    console.log("Bank Account Query:", accountDataQuery.toString());
    const { data: accountData, error: accountError } = await accountDataQuery;
    console.log("Bank Account Query Result:", { data: accountData, error: accountError });

    if (accountError)
      return res.status(404).json({ error: "Bank account not found" });

    const account_id = accountData.account_id;
    console.log("Account ID:", account_id);

    const expenditureInsertQuery = supabase
      .from("expenditures")
      .insert([{ account_id, category, amount, description }])
      .single();
    console.log("Expenditure Insert Query:", expenditureInsertQuery.toString());
    const { data, error } = await expenditureInsertQuery;
    console.log("Expenditure Insert Query Result:", { data, error });

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "✅ Expenditure added", expenditure: data });
  } catch (err) {
    console.error("Error in /api/expenditures:", err);
    console.error("Full error object:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;