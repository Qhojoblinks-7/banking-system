// src/api/middleware/authMiddleware.js
import {supabaseAdmin}  from '../../supabaseServiceRole.js'; // Adjust path as needed

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token missing' });
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error) {
      console.error("Supabase Admin SDK token verification error:", error);
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token or user not found' });
    }

    req.user = user; // Attach user information to the request
    next();

  } catch (error) {
    console.error("Error verifying token with Supabase Admin SDK:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};