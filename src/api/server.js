// server.js

// ======== Imports ========
import { config } from 'dotenv';
config({ path: '../.env' });

import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

// Import route modules
import adminRoutes from './adminRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import cardRoutes from './cardRoutes.js';
import loanRoutes from './loanRoutes.js';
import transferRoutes from './transferRoutes.js';
import expenditureRoutes from './expenditureRoutes.js';
import investmentRoutes from './investmentRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import withdrawalRoutes from './withdrawalRoutes.js';

// ======== Module Scope Variables ========
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======== Initialize Express App ========
const app = express();

// ======== Middleware ========
// Body parsing middleware
app.use(express.json());



// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Cookie parsing middleware
app.use(cookieParser());

// Middleware to log incoming requests and responses
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  res.on('finish', () => {
    console.log(`Response status: ${res.statusCode}`);
  });
  next();
});

// ======== CORS Configuration ========
const allowedOrigins = [
  'http://localhost:5173', // React Dev Server
  'http://localhost:3000', // API Server
];

// Apply CORS Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, Postman, curl)
      if (!origin) return callback(null, true);

      // Allow requests from known origins and Vercel deployments
      if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
        return callback(null, true);
      }

      // Block unknown origins
      return callback(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Expires'],
    credentials: true, // Allow cookies and authentication headers
  })
);

// ======== Load Environment Variables ========
const JWT_SECRET = process.env.JWT_SECRET;
console.log('JWT_SECRET:', JWT_SECRET); // Add this line
if (!JWT_SECRET) {
  throw new Error('Missing required environment variables: JWT_SECRET');
}

// ======== Mount Routes ========
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/expenditures', expenditureRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/withdraw', withdrawalRoutes);

// ======== Public Endpoints ========

// Dummy Exchange Rates Endpoint
app.get('/api/exchange-rates', (req, res) => {
  const dummyTrends = [
    { date: '2023-01-01', rate: 1.2 },
    { date: '2023-02-01', rate: 1.3 },
    { date: '2023-03-01', rate: 1.15 },
    { date: '2023-04-01', rate: 1.22 },
    { date: '2023-05-01', rate: 1.18 },
  ];
  res.json({ trends: dummyTrends });
});

// Test database connection
app.get('/api/test-connection', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_accounts')
      .select('*')
      .limit(1);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: '✅ Connection successful', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======== Start the Server ========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API server running on port ${PORT}`));
