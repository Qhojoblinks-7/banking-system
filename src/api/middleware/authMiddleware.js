import { supabaseAdmin } from '../../supabaseServiceRole.js'; // Adjust path if necessary

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - Token missing or invalid format' });
    }

    const token = authHeader.split(' ')[1];

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error) {
      console.error("Supabase Admin SDK token verification error:", error);
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }

    if (!data || !data.user || !data.user.id) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token or user not found' });
    }

    req.user = { user_id: data.user.id }; 
    next();
  } catch (err) {
    console.error("Unexpected error in token authentication:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
