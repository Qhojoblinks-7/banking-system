// filepath: /c:/Users/imman/Downloads/banking-system/backend/testEnv.js
const fs = require('fs');
const dotenv = require('dotenv');

// Check if .env file exists
if (fs.existsSync('./.env')) {
    console.log('.env file exists');
} else {
    console.error('.env file does not exist');
}

const result = dotenv.config({ path: './.env' });

if (result.error) {
    console.error('Error loading .env file:', result.error);
} else {
    console.log('.env file loaded successfully');
}

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY);