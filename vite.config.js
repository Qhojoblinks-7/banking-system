import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_SUPABASE_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
