const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// List of environment variables to set in Vercel
const envVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'DATABASE_URL',
  'JWT_SECRET',
  'PORT'
];

// Function to set environment variables in Vercel
const setEnvVarsInVercel = (envVars) => {
  envVars.forEach((envVar) => {
    const value = process.env[envVar];
    if (value) {
      try {
        execSync(`vercel env add ${envVar} production`, { input: `${value}\n` });
        console.log(`Successfully set ${envVar} in Vercel`);
      } catch (error) {
        console.error(`Failed to set ${envVar} in Vercel:`, error.message);
      }
    } else {
      console.warn(`Environment variable ${envVar} is not defined in .env file`);
    }
  });
};

// Set environment variables in Vercel
setEnvVarsInVercel(envVars);