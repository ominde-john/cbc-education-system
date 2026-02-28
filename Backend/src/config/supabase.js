const { createClient } = require('@supabase/supabase-js');

// Supabase credentials - using environment variables with fallback to default values
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://ywcrsgaxftooovqipkdr.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.warn('⚠️  Using default Supabase credentials from config. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env to override.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
