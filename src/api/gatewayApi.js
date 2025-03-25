// gatewayApi.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });
dotenv.config();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Supabase Setup
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Real-world DB insertion function
const createTransaction = async (transactionData) => {
  const { data, error } = await supabase.from("transactions").insert([
    {
      account_id: transactionData.account_id,
      transaction_type: transactionData.transaction_type,
      amount: transactionData.amount,
      description: transactionData.description,
      scheduled_date: transactionData.scheduled_date,
    },
  ]).select().single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Payment Simulation Function (Real-world adjustments)
const simulatePaymentProcess = (transaction, type, delay, successProbability) => {
  io.emit("paymentStatus", {
    transactionId: transaction.transaction_id,
    status: "processing",
    type,
  });

  setTimeout(async () => {
    const isSuccess = Math.random() < successProbability;
    const finalStatus = isSuccess ? "success" : "failed";

    if (isSuccess) {
      await supabase
        .from("transactions")
        .update({ status: finalStatus })
        .eq("transaction_id", transaction.transaction_id);

      io.emit("paymentStatus", {
        transactionId: transaction.transaction_id,
        status: finalStatus,
        type,
        payload: transaction,
      });
    } else {
      await supabase
        .from("transactions")
        .update({ status: finalStatus })
        .eq("transaction_id", transaction.transaction_id);

      io.emit("paymentStatus", {
        transactionId: transaction.transaction_id,
        status: finalStatus,
        type,
        payload: transaction,
      });
    }
  }, delay);
};

// --- Deposit Endpoint ---
app.post("/api/deposit", async (req, res) => {
  const { account_number, amount, description } = req.body;
  try {
    const { data: accountData, error: accountError } = await supabase
      .from("bank_accounts")
      .select("account_id")
      .eq("account_number", account_number)
      .single();

    if (accountError || !accountData) {
      return res.status(404).json({ error: "Account not found." });
    }

    const transaction = await createTransaction({
      account_id: accountData.account_id,
      transaction_type: "deposit",
      amount,
      description: description || "Deposit via bank transfer",
      scheduled_date: null,
    });

    const { data: account, error: balanceError } = await supabase
      .from("bank_accounts")
      .select("balance")
      .eq("account_id", accountData.account_id)
      .single();

    if (balanceError || !account) {
      return res.status(404).json({ error: "Account balance not found." });
    }

    const newBalance = account.balance + amount;

    await supabase
      .from("bank_accounts")
      .update({ balance: newBalance })
      .eq("account_id", accountData.account_id);

    res.json({ success: true, transaction });
    simulatePaymentProcess(transaction, "deposit", 2000, 0.95);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Transfer Endpoint ---
app.post("/api/transfer", async (req, res) => {
  const { from_account_number, to_account_number, amount, description } = req.body;
  try {
    const { data: fromAccountData, error: fromAccountError } = await supabase
      .from("bank_accounts")
      .select("account_id")
      .eq("account_number", from_account_number)
      .single();

    const { data: toAccountData, error: toAccountError } = await supabase
      .from("bank_accounts")
      .select("account_id")
      .eq("account_number", to_account_number)
      .single();

    if (fromAccountError || !fromAccountData || toAccountError || !toAccountData) {
      return res.status(404).json({ error: "One or both accounts not found." });
    }

    const transaction = await supabase.from("transfers").insert([
      {
        from_account: fromAccountData.account_id,
        to_account: toAccountData.account_id,
        amount: amount,
        description: description || "Transfer between accounts",
      },
    ]).select().single();

    if (transaction.error) {
      throw new Error(transaction.error.message);
    }

    res.json({ success: true, transaction: transaction.data });
    simulatePaymentProcess(transaction.data, "transfer", 2500, 0.90);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Withdrawal Endpoint ---
app.post("/api/withdraw", async (req, res) => {
  const { account_number, amount, method, scheduled_date } = req.body;
  try {
    const { data: accountData, error: accountError } = await supabase
      .from("bank_accounts")
      .select("account_id")
      .eq("account_number", account_number)
      .single();

    if (accountError || !accountData) {
      return res.status(404).json({ error: "Account not found." });
    }

    const transaction = await createTransaction({
      account_id: accountData.account_id,
      transaction_type: "withdrawal",
      amount,
      description: method || "Withdrawal request",
      scheduled_date: scheduled_date || null,
    });

    const { data: account, error: balanceError } = await supabase
      .from("bank_accounts")
      .select("balance")
      .eq("account_id", accountData.account_id)
      .single();

    if (balanceError || !account) {
      return res.status(404).json({ error: "Account balance not found." });
    }

    const newBalance = account.balance - amount;

    await supabase
      .from("bank_accounts")
      .update({ balance: newBalance })
      .eq("account_id", accountData.account_id);

    res.json({ success: true, transaction: { withdrawal: transaction } });
    simulatePaymentProcess(transaction, "withdrawal", 3000, 0.92);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Test Deposit Endpoint (Real-world) ---
app.post("/api/test-deposit", async (req, res) => {
  const { account_number, amount } = req.body;
  try {
    const { data: accountData, error: accountError } = await supabase
      .from("bank_accounts")
      .select("account_id")
      .eq("account_number", account_number)
      .single();

    if (accountError || !accountData) {
      return res.status(404).json({ error: "Account not found." });
    }

    const transaction = await createTransaction({
      account_id: accountData.account_id,
      transaction_type: "deposit",
      amount: amount,
      description: "Test deposit",
      scheduled_date: null,
    });

    const { data: account, error: balanceError } = await supabase
      .from("bank_accounts")
      .select("balance")
      .eq("account_id", accountData.account_id)
      .single();

    if (balanceError || !account) {
      return res.status(404).json({ error: "Account balance not found." });
    }

    const newBalance = account.balance + amount;

    await supabase
      .from("bank_accounts")
      .update({ balance: newBalance })
      .eq("account_id", accountData.account_id);

    res.json({
      success: true,
      message: `Successfully added GHC ${amount} to account ${account_number}`,
      transaction,
    });

    io.emit("paymentStatus", {
      transactionId: transaction.transaction_id,
      status: "success",
      type: "test-deposit",
      payload: transaction,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Payment Gateway Server running on port ${PORT}`);
});