// transferRoutes.js
import express from "express";
import { supabase } from "../adminSupabaseClient.js";
import { authenticateToken } from "./middleware/authMiddleware.js"; // Assuming you have this middleware

const router = express.Router();

// Initiate a fund transfer
router.post("/", authenticateToken, async (req, res) => {
  console.log("Incoming request: POST /api/transfers");
  console.log("Authenticated user:", req.user);
  console.log("Request Body:", req.body);
  try {
    const { to_account, amount, description } = req.body;
    const { user_id } = req.user;
    console.log("Initiating transfer for user_id:", user_id, "to account:", to_account, "amount:", amount);

    const accountDataQuery = supabase
      .from("bank_accounts")
      .select("account_id")
      .eq("user_id", user_id)
      .single();
    console.log("Sender Bank Account Query:", accountDataQuery.toString());
    const { data: accountData, error: accountError } = await accountDataQuery;
    console.log("Sender Bank Account Query Result:", { data: accountData, error: accountError });

    if (accountError)
      return res.status(404).json({ error: "Sender bank account not found" });

    const from_account = accountData.account_id;
    console.log("Sender Account ID:", from_account);

    const transferInsertQuery = supabase
      .from("transfers")
      .insert([{ from_account, to_account, amount, description }])
      .single();
    console.log("Transfer Insert Query:", transferInsertQuery.toString());
    const { data, error } = await transferInsertQuery;
    console.log("Transfer Insert Query Result:", { data, error });

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "✅ Transfer initiated", transfer: data });
  } catch (err) {
    console.error("Error in /api/transfers:", err);
    console.error("Full error object:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;