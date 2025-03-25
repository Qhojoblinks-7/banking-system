// analyticsRoutes.js
import express from "express";
import { supabase } from "../adminSupabaseClient.js";
import { authenticateToken } from "./middleware/authMiddleware.js"; // Assuming you have this middleware

const router = express.Router();

// Retrieve analytics for the authenticated user
router.get("/", authenticateToken, async (req, res) => {
  console.log("Incoming request: GET /api/analytics");
  console.log("Authenticated user:", req.user);
  try {
    const { user_id } = req.user;
    console.log("Fetching analytics for user_id:", user_id);

    const analyticsQuery = supabase
      .from("analytics")
      .select("*")
      .eq("user_id", user_id)
      .single();
    console.log("Analytics Query:", analyticsQuery.toString());
    const { data, error } = await analyticsQuery;
    console.log("Analytics Query Result:", { data, error });

    if (error) return res.status(400).json({ error: error.message });
    res.json({ analytics: data });
  } catch (err) {
    console.error("Error in /api/analytics:", err);
    console.error("Full error object:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;