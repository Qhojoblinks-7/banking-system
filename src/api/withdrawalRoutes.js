// withdrawalRoutes.js
import express from "express";
import { supabaseAdmin } from "../supabaseServiceRole.js"; // Import supabaseAdmin
import { authenticateToken } from "./middleware/authMiddleware.js"; // Assuming you have this middleware

const router = express.Router();

// Create a withdrawal request
router.post("/", authenticateToken, async (req, res) => {
  console.log("Incoming request: POST /api/withdraw");
  console.log("Authenticated user:", req.user);
  console.log("Request Body:", req.body);
  try {
    const { account_number, amount, method, scheduled_date } = req.body;
    const { user_id } = req.user;
    console.log("Processing withdrawal for user_id:", user_id, "account:", account_number, "amount:", amount);

    const accountDataQuery = supabaseAdmin // Use supabaseAdmin
      .from("bank_accounts")
      .select("*")
      .eq("user_id", user_id)
      .eq("account_number", account_number)
      .single();
    console.log("Bank Account Query:", accountDataQuery.toString());
    const { data: accountData, error: accountError } = await accountDataQuery;
    console.log("Bank Account Query Result:", { data: accountData, error: accountError });

    if (!accountData) {
      return res.status(404).json({ error: "Bank account not found or does not belong to user" });
    }

    const account = accountData;
    console.log("Account Details:", account);

    if (amount <= 0 || amount > account.balance) {
      return res.status(400).json({ error: "Invalid withdrawal amount" });
    }

    const newBalance = account.balance - amount;
    console.log("New Balance:", newBalance);

    const updateBalanceQuery = supabaseAdmin // Use supabaseAdmin
      .from("bank_accounts")
      .update({ balance: newBalance })
      .eq("account_id", account.account_id);
    console.log("Update Balance Query:", updateBalanceQuery.toString());
    const { error: updateError } = await updateBalanceQuery;
    console.log("Update Balance Query Result:", { error: updateError });

    if (updateError) return res.status(400).json({ error: updateError.message });

    const description = `Withdrawal via ${method}` + (scheduled_date ? ` scheduled on ${scheduled_date}` : "");
    console.log("Transaction Description:", description);

    const transactionInsertQuery = supabaseAdmin // Use supabaseAdmin
      .from("transactions")
      .insert([{ account_id: account.account_id, transaction_type: "withdrawal", amount, description }])
      .single();
    console.log("Transaction Insert Query:", transactionInsertQuery.toString());
    const { data: withdrawalData, error: txError } = await transactionInsertQuery;
    console.log("Transaction Insert Query Result:", { data: withdrawalData, error: txError });

    if (txError) return res.status(400).json({ error: txError.message });
    res.json({ message: "✅ Withdrawal processed successfully", withdrawal: withdrawalData });
  } catch (err) {
    console.error("Withdrawal error:", err);
    console.error("Full error object:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;