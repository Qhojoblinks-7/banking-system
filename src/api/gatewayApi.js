// gatewayApi.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "http://localhost:5173" } });

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Dummy DB insertion function (simulate insertion into your transactions table)
const createTransaction = async (transactionData) => {
  // In a real implementation, perform a DB insert here.
  return {
    ...transactionData,
    transaction_id: Date.now(), // Unique transaction ID based on timestamp
    transaction_timestramp: new Date().toISOString(),
  };
};

// Payment Simulation Function
const simulatePaymentProcess = (transaction, type, delay, successProbability) => {
  // Immediately emit a "processing" event
  io.emit("paymentStatus", {
    transactionId: transaction.transaction_id,
    status: "processing",
    type,
  });

  // After a delay, determine success or failure
  setTimeout(() => {
    const isSuccess = Math.random() < successProbability;
    const finalStatus = isSuccess ? "success" : "failed";
    // In a real system, you might update the DB record here to reflect the final status.
    io.emit("paymentStatus", {
      transactionId: transaction.transaction_id,
      status: finalStatus,
      type,
      payload: transaction,
    });
  }, delay);
};

// --- Deposit Endpoint ---
app.post("/api/deposit", async (req, res) => {
  const { account_id, amount, description } = req.body;
  try {
    const transaction = await createTransaction({
      account_id,
      transaction_type: "deposit",
      amount,
      description: description || "Deposit via bank transfer",
    });
    res.json({ success: true, transaction });
    simulatePaymentProcess(transaction, "deposit", 2000, 0.95);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Transfer Endpoint ---
app.post("/api/transfer", async (req, res) => {
  const { account_id, amount, description } = req.body;
  try {
    const transaction = await createTransaction({
      account_id,
      transaction_type: "transfer",
      amount,
      description: description || "Transfer to another account",
    });
    res.json({ success: true, transaction });
    simulatePaymentProcess(transaction, "transfer", 2500, 0.90);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Withdrawal Endpoint ---
app.post("/api/withdraw", async (req, res) => {
  const { account_id, amount, description } = req.body;
  try {
    const transaction = await createTransaction({
      account_id,
      transaction_type: "withdrawal",
      amount,
      description: description || "Withdrawal request",
    });
    res.json({ success: true, transaction });
    simulatePaymentProcess(transaction, "withdrawal", 3000, 0.92);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

server.listen(3000, () => {
  console.log("Payment Gateway Server running on port 3000");
});
