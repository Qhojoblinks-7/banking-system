require('dotenv').config({ path: './.env' });
const { createClient } = require('@supabase/supabase-js');

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // or use the anon key for public access
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
