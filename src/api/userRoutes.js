// userRoutes.js
import express from "express";
import { supabaseAdmin as supabase } from "../supabaseServiceRole.js"; // Or your alias
import { authenticateToken } from "./middleware/authMiddleware.js"; // Assuming you have this middleware

const router = express.Router();

// Overview endpoint to fetch user, account, and transactions
router.get("/overview", authenticateToken, async (req, res) => {
  console.log("Incoming request: GET /api/overview");
  console.log("Authenticated user:", req.user);
  try {
    const { user_id } = req.user;
    const { filter = "all" } = req.query;
    console.log("Query Parameters:", { filter });

    const userQuery = supabase // Use supabaseAdmin
      .from("user_accounts")
      .select("*")
      .eq("user_id", user_id)
      .maybeSingle();
    console.log("User Query:", userQuery.toString());
    const { data: user, error: userError } = await userQuery;
    console.log("User Query Result:", { data: user, error: userError });
    if (userError) {
      console.error("User fetch error:", userError);
      return res.status(400).json({ error: userError.message });
    }
    if (!user) {
      console.error("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    const bankAccountsQuery = supabase // Use supabaseAdmin
      .from("bank_accounts")
      .select("*")
      .eq("user_id", user_id);
    console.log("Bank Accounts Query:", bankAccountsQuery.toString());
    const { data: bankAccounts, error: bankError } = await bankAccountsQuery;
    console.log("Bank Accounts Query Result:", { data: bankAccounts, error: bankError });
    if (bankError) {
      console.error("Bank accounts fetch error:", bankError);
      return res.status(400).json({ error: bankError.message });
    }
    if (!bankAccounts || bankAccounts.length === 0) {
      console.error("Bank account not found");
      return res.status(404).json({ error: "Bank account not found" });
    }

    const bankAccount = bankAccounts[0];
    console.log("Selected Bank Account:", bankAccount);

    const transactionsQuery = supabase // Use supabaseAdmin
      .from("transactions")
      .select("*")
      .eq("account_id", bankAccount.account_id);
    console.log("Transactions Query:", transactionsQuery.toString());
    const { data: transactions, error: txError } = await transactionsQuery;
    console.log("Transactions Query Result:", { data: transactions, error: txError });
    if (txError) {
      console.error("Transactions fetch error:", txError);
      return res.status(400).json({ error: txError.message });
    }

    const formattedTransactions = transactions.map(txn => ({
      transaction_id: txn.transaction_id, // Keep original ID if needed
      account_id: txn.account_id,       // Keep original account ID if needed
      type: txn.transaction_type === "withdrawal" ? "expense" : "receive", // Create 'type'
      amount: txn.amount,
      time: new Date(txn.transaction_timestamp).toLocaleTimeString(), // Format timestamp to time
      name: txn.description || "N/A", // Use description as name, default to "N/A"
      description: txn.description, // Keep original description if needed
      transaction_timestamp: txn.transaction_timestamp // Keep original timestamp if needed
    }));

    let filteredTransactions = formattedTransactions; // Use the formatted transactions for filtering
    if (filter === "expenses") {
      filteredTransactions = formattedTransactions.filter(
        (tx) => tx.type === "expense"
      );
    } else if (filter === "receives") {
      filteredTransactions = formattedTransactions.filter(
        (tx) => tx.type === "receive"
      );
    }

    console.log("Overview data:", { user, account: bankAccount, transactions: filteredTransactions });
    res.json({
      user,
      account: bankAccount,
      transactions: filteredTransactions,
    });
  } catch (err) {
    console.error("Overview error:", err);
    console.error("Full error object:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get user details
router.get("/user", authenticateToken, async (req, res) => {
  console.log("Incoming request: GET /api/user");
  console.log("Authenticated user:", req.user);
  try {
    // Check if req.user and req.user.user_id exist
    if (!req.user || !req.user.user_id) {
      console.error("Authentication error: req.user or user_id is missing.");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { user_id } = req.user;
    console.log("Fetching user with user_id:", user_id);

    const userQuery = supabase // Use supabaseAdmin
      .from("user_accounts")
      .select("*")
      .eq("user_id", user_id)
      .limit(1)
      .maybeSingle();
    console.log("User Query:", userQuery.toString());
    const { data: user, error: userError } = await userQuery;
    console.log("User Query Result:", { data: user, error: userError });

    if (userError) {
      console.error("Supabase user query error:", userError);
      return res.status(400).json({ error: userError.message });
    }

    if (!user) {
      console.error("User not found for ID:", user_id);
      return res.status(404).json({ error: "User not found" });
    }

    const bankAccountQuery = supabase // Use supabaseAdmin
      .from("bank_accounts")
      .select("account_number")
      .eq("user_id", user_id)
      .limit(1)
      .maybeSingle();
    console.log("Bank Account Query:", bankAccountQuery.toString());
    const { data: bankAccount, error: bankError } = await bankAccountQuery;
    console.log("Bank Account Query Result:", { data: bankAccount, error: bankError });

    if (bankError) {
      console.error("Supabase bank account query error:", bankError);
      return res.status(400).json({ error: bankError.message });
    }

    if (!bankAccount) {
      console.error("Bank account not found for user ID:", user_id);
      return res.status(404).json({ error: "Bank account not found" });
    }

    res.json({ user, account_number: bankAccount.account_number });
  } catch (err) {
    console.error("Error in /api/user:", err);
    console.error("Full error object:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get user balance
router.get("/balance", authenticateToken, async (req, res) => {
  console.log("Incoming request: GET /api/balance");
  console.log("Authenticated user:", req.user);
  try {
    const { user_id } = req.user;
    console.log("Fetching balance for user_id:", user_id);

    const balanceQuery = supabase // Use supabaseAdmin
      .from("bank_accounts")
      .select("balance, account_number")
      .eq("user_id", user_id)
      .single();
    console.log("Balance Query:", balanceQuery.toString());
    const { data, error } = await balanceQuery;
    console.log("Balance Query Result:", { data, error });

    if (error) {
      console.error("Supabase balance query error:", error);
      return res.status(400).json({ error: error.message });
    }

    res.json({ balance: data.balance, account_number: data.account_number });
  } catch (err) {
    console.error("Error in /api/balance:", err);
    console.error("Full error object:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;