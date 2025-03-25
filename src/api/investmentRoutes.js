// investmentRoutes.js
import express from "express";
import { supabase } from "../adminSupabaseClient.js";
import { authenticateToken } from "./middleware/authMiddleware.js"; // Assuming you have this middleware

const router = express.Router();

// Retrieve investments for the authenticated user
router.get("/", authenticateToken, async (req, res) => {
  console.log("Incoming request: GET /api/investments");
  console.log("Authenticated user:", req.user);
  try {
    const { user_id } = req.user;
    console.log("Fetching investments for user_id:", user_id);

    const investmentsQuery = supabase
      .from("investments")
      .select("*")
      .eq("user_id", user_id);
    console.log("Investments Query:", investmentsQuery.toString());
    const { data, error } = await investmentsQuery;
    console.log("Investments Query Result:", { data, error });

    if (error) return res.status(400).json({ error: error.message });
    res.json({ investments: data });
  } catch (err) {
    console.error("Error in /api/investments:", err);
    console.error("Full error object:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add an investment
router.post("/", authenticateToken, async (req, res) => {
  console.log("Incoming request: POST /api/investments");
  console.log("Authenticated user:", req.user);
  console.log("Request Body:", req.body);
  try {
    const { asset_type, asset_name, quantity, purchase_price, current_price, status } = req.body;
    const { user_id } = req.user;
    console.log("Adding investment for user_id:", user_id, "asset:", asset_name);

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

    const investStatus = status || "active";
    const investCurrentPrice = current_price || purchase_price;

    const investmentInsertQuery = supabase
      .from("investments")
      .insert([
        {
          user_id,
          account_id,
          asset_type,
          asset_name,
          quantity,
          purchase_price,
          current_price: investCurrentPrice,
          status: investStatus,
        },
      ])
      .single();
    console.log("Investment Insert Query:", investmentInsertQuery.toString());
    const { data, error } = await investmentInsertQuery;
    console.log("Investment Insert Query Result:", { data, error });

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "✅ Investment added", investment: data });
  } catch (err) {
    console.error("Error in /api/investments:", err);
    console.error("Full error object:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;