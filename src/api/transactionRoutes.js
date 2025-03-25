// transactionRoutes.js
import express from "express";
import { supabaseAdmin } from "../supabaseServiceRole.js"; // Import supabaseAdmin
import { authenticateToken } from "./middleware/authMiddleware.js"; // Assuming you have this middleware

const router = express.Router();

// Retrieve transactions for the authenticated user
router.get("/", authenticateToken, async (req, res) => {
  console.log("Incoming request: GET /api/transactions");
  console.log("Authenticated user:", req.user);
  try {
    const { user_id } = req.user;
    console.log("Fetching transactions for user_id:", user_id);

    const bankAccountQuery = supabaseAdmin // Use supabaseAdmin
      .from("bank_accounts")
      .select("account_id")
      .eq("user_id", user_id)
      .limit(1)
      .maybeSingle();
    console.log("Bank Account Query:", bankAccountQuery.toString());
    const { data: bankAccount, error: bankError } = await bankAccountQuery;
    console.log("Bank Account Query Result:", { data: bankAccount, error: bankError });

    if (bankError) return res.status(400).json({ error: bankError.message });
    if (!bankAccount) {
      console.error("Bank account not found for user ID:", user_id);
      return res.status(404).json({ error: "Bank account not found" });
    }

    const transactionsQuery = supabaseAdmin // Use supabaseAdmin
      .from("transactions")
      .select("*")
      .eq("account_id", bankAccount.account_id);
    console.log("Transactions Query:", transactionsQuery.toString());
    const { data: transactions, error } = await transactionsQuery;
    console.log("Transactions Query Result:", { data: transactions, error });

    if (error) return res.status(400).json({ error: error.message });
    res.json({ transactions });
  } catch (err) {
    console.error("Error in /api/transactions:", err);
    console.error("Full error object:", err);
    res.status(500).json({ error: err.message });
  }
});

// Create a new transaction
router.post("/", authenticateToken, async (req, res) => {
  console.log("Incoming request: POST /api/transactions");
  console.log("Authenticated user:", req.user);
  console.log("Request Body:", req.body);
  try {
    const { transaction_type, amount, description } = req.body;
    const { user_id } = req.user;
    console.log("Creating transaction for user_id:", user_id);

    const accountDataQuery = supabaseAdmin // Use supabaseAdmin
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

    const transactionInsertQuery = supabaseAdmin // Use supabaseAdmin
      .from("transactions")
      .insert([{ account_id, transaction_type, amount, description }])
      .single();
    console.log("Transaction Insert Query:", transactionInsertQuery.toString());
    const { data, error } = await transactionInsertQuery;
    console.log("Transaction Insert Query Result:", { data, error });

    if (error) return res.status(400).json({ error: error.message });
    res.json({
      message: "✅ Transaction added successfully",
      transaction: data,
    });
  } catch (err) {
    console.error("Error in /api/transactions:", err);
    console.error("Full error object:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;