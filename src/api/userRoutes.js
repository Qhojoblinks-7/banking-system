import express from "express";
import { supabaseAdmin as supabase } from "../supabaseServiceRole.js"; // Ensure it's the correct import
import { authenticateToken } from "./middleware/authMiddleware.js"; // Assuming you have this middleware

const router = express.Router();

/**
 * Overview: Fetches user, bank account, and transactions.
 */
router.get("/overview", authenticateToken, async (req, res) => {
  console.log("Incoming request: GET /api/overview");
  console.log("Authenticated user:", req.user);

  try {
    const { user_id } = req.user;
    const { filter = "all" } = req.query;

    console.log("Fetching data for user_id:", user_id, "with filter:", filter);

    // Fetch user details
    const { data: user, error: userError } = await supabase
      .from("user_accounts")
      .select("*")
      .eq("user_id", user_id)
      .maybeSingle();

    if (userError) {
      console.error("Error fetching user:", userError);
      return res.status(400).json({ error: userError.message });
    }
    if (!user) {
      console.error("User not found for ID:", user_id);
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch user's bank account
    const { data: bankAccounts, error: bankError } = await supabase
      .from("bank_accounts")
      .select("*")
      .eq("user_id", user_id);

    if (bankError) {
      console.error("Error fetching bank accounts:", bankError);
      return res.status(400).json({ error: bankError.message });
    }
    if (!bankAccounts || bankAccounts.length === 0) {
      console.error("No bank account found for user:", user_id);
      return res.status(404).json({ error: "Bank account not found" });
    }

    const bankAccount = bankAccounts[0];

    // Fetch transactions
    const { data: transactions, error: txError } = await supabase
      .from("transactions")
      .select("*")
      .eq("account_id", bankAccount.account_id);

    if (txError) {
      console.error("Error fetching transactions:", txError);
      return res.status(400).json({ error: txError.message });
    }

    // Format transactions
    const formattedTransactions = transactions.map(txn => ({
      transaction_id: txn.transaction_id,
      account_id: txn.account_id,
      type: txn.transaction_type === "withdrawal" ? "expense" : "receive",
      amount: txn.amount,
      time: new Date(txn.transaction_timestamp).toLocaleTimeString(),
      name: txn.description || "N/A",
      description: txn.description,
      transaction_timestamp: txn.transaction_timestamp
    }));

    // Apply filters
    let filteredTransactions = formattedTransactions;
    if (filter === "expenses") {
      filteredTransactions = formattedTransactions.filter(tx => tx.type === "expense");
    } else if (filter === "receives") {
      filteredTransactions = formattedTransactions.filter(tx => tx.type === "receive");
    }

    res.json({
      user,
      account: bankAccount,
      transactions: filteredTransactions,
    });
  } catch (err) {
    console.error("Server error in /api/overview:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Fetches user details.
 */
router.get("/user", authenticateToken, async (req, res) => {
  console.log("Incoming request: GET /api/user");
  console.log("Authenticated user:", req.user);

  try {
    if (!req.user || !req.user.user_id) {
      console.error("Unauthorized request: Missing user_id");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { user_id } = req.user;

    const { data: user, error: userError } = await supabase
      .from("user_accounts")
      .select("*")
      .eq("user_id", user_id)
      .maybeSingle();

    if (userError) {
      console.error("Error fetching user:", userError);
      return res.status(400).json({ error: userError.message });
    }
    if (!user) {
      console.error("User not found:", user_id);
      return res.status(404).json({ error: "User not found" });
    }

    const { data: bankAccount, error: bankError } = await supabase
      .from("bank_accounts")
      .select("account_number")
      .eq("user_id", user_id)
      .maybeSingle();

    if (bankError) {
      console.error("Error fetching bank account:", bankError);
      return res.status(400).json({ error: bankError.message });
    }
    if (!bankAccount) {
      console.error("Bank account not found:", user_id);
      return res.status(404).json({ error: "Bank account not found" });
    }

    res.json({ user, account_number: bankAccount.account_number });
  } catch (err) {
    console.error("Error in /api/user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Fetches user balance.
 */
router.get("/balance", authenticateToken, async (req, res) => {
  console.log("Incoming request: GET /api/balance");
  console.log("Authenticated user:", req.user);

  try {
    if (!req.user || !req.user.user_id) {
      console.error("Unauthorized request: Missing user_id");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { user_id } = req.user;

    const { data, error } = await supabase
      .from("bank_accounts")
      .select("balance, account_number")
      .eq("user_id", user_id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching balance:", error);
      return res.status(400).json({ error: error.message });
    }
    if (!data) {
      console.error("Bank account not found for user:", user_id);
      return res.status(404).json({ error: "Bank account not found" });
    }

    res.json({ balance: data.balance, account_number: data.account_number });
  } catch (err) {
    console.error("Error in /api/balance:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
