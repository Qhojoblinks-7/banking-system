// cardRoutes.js
import express from "express";
import bcrypt from "bcrypt";
import { supabase } from "../adminSupabaseClient.js";
import { authenticateToken } from "./middleware/authMiddleware.js"; // Assuming you have this middleware

const router = express.Router();

// Add a new card
router.post("/", authenticateToken, async (req, res) => {
  console.log("Incoming request: POST /api/cards");
  console.log("Authenticated user:", req.user);
  console.log("Request Body:", req.body);
  try {
    const { card_number, cvv, expiry_date, card_type, card_provider } = req.body;
    const user_id = req.user.user_id;
    const hashedCardNumber = await bcrypt.hash(card_number, 10);
    const hashedCvv = await bcrypt.hash(cvv, 10);
    const lastFourDigits = card_number.slice(-4);
    console.log("Hashed Card Number:", hashedCardNumber);
    console.log("Hashed CVV:", hashedCvv);
    console.log("Last Four Digits:", lastFourDigits);

    const cardInsertQuery = supabase
      .from("cards")
      .insert([
        {
          user_id,
          hashed_card_number: hashedCardNumber,
          last_four_digits: lastFourDigits,
          hashed_cvv: hashedCvv,
          expiry_date,
          card_type,
          card_provider,
          card_status: "active",
        },
      ])
      .single();
    console.log("Card Insert Query:", cardInsertQuery.toString());
    const { data, error } = await cardInsertQuery;
    console.log("Card Insert Query Result:", { data, error });

    if (error) {
      console.error("Supabase card insert error:", error);
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: "✅ Card added successfully",
      card: { last_four_digits: data.last_four_digits, expiry_date },
    });
  } catch (err) {
    console.error("Error in /api/cards:", err);
    console.error("Full error object:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all cards for a user
router.get("/", authenticateToken, async (req, res) => {
  console.log("Incoming request: GET /api/cards");
  console.log("Authenticated user:", req.user);
  try {
    const { user_id } = req.user;
    console.log("Fetching cards for user_id:", user_id);

    const cardsQuery = supabase
      .from("cards")
      .select("last_four_digits, expiry_date, card_type, card_provider")
      .eq("user_id", user_id);
    console.log("Cards Query:", cardsQuery.toString());
    const { data, error } = await cardsQuery;
    console.log("Cards Query Result:", { data, error });

    if (error) {
      console.error("Supabase card select error:", error);
      return res.status(400).json({ error: error.message });
    }

    res.json({ cards: data });
  } catch (err) {
    console.error("Error in /api/cards:", err);
    console.error("Full error object:", err);
    res.status(500).json({ error: err.message });
  }
});

// Verify card number
router.post("/verify", authenticateToken, async (req, res) => {
  console.log("Incoming request: POST /api/cards/verify");
  console.log("Authenticated user:", req.user);
  console.log("Request Body:", req.body);
  try {
    const { card_number } = req.body;
    const user_id = req.user.user_id;
    console.log("Verifying card for user_id:", user_id);

    const cardQuery = supabase
      .from("cards")
      .select("hashed_card_number")
      .eq("user_id", user_id)
      .single();
    console.log("Verify Card Query:", cardQuery.toString());
    const { data, error } = await cardQuery;
    console.log("Verify Card Query Result:", { data, error });

    if (error) return res.status(400).json({ error: "Card not found" });

    const match = await bcrypt.compare(card_number, data.hashed_card_number);
    console.log("Card verification match:", match);
    res.json({ verified: match });
  } catch (err) {
    console.error("Error in /api/cards/verify:", err);
    console.error("Full error object:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;