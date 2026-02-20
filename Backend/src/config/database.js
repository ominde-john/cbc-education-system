const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Get Supabase connection from environment or construct it
let connectionString = process.env.DATABASE_URL;

// If no DATABASE_URL, try to construct from Supabase URL
if (!connectionString && process.env.VITE_SUPABASE_URL) {
  // Extract project ref from Supabase URL (e.g., https://xxxxx.supabase.co -> xxxxx)
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
  
  // Supabase direct database connection string format
  // You need to get the password from your Supabase dashboard -> Settings -> Database
  // For now, we'll try without password which will fail, but will show the correct format
  connectionString = `postgres://postgres:[YOUR-PASSWORD]@db.${projectRef}.supabase.co:5432/postgres`;
}

if (!connectionString) {
  console.error('❌ No DATABASE_URL or VITE_SUPABASE_URL found in environment');
  console.log('Please add DATABASE_URL to your .env file or set VITE_SUPABASE_URL');
  process.exit(1);
}

// Check if the connection string still has placeholder
if (connectionString.includes('[YOUR-PASSWORD]')) {
  console.warn('⚠️  DATABASE_URL appears to have a placeholder password.');
  console.log('Please update your .env file with the actual Supabase database password.');
  console.log('Format: postgres://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres');
}

// Database connection configuration
const pool = new Pool({
  connectionString: connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : { rejectUnauthorized: false },
  max: 30,
  min: 5,
  idle: 5000,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 60000,
  statement_timeout: 30000,
  query_timeout: 30000,
});

// Test database connection
pool.on('connect', () => {
  console.log('🗄️  Connected to database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

// Enhanced query function with error handling and logging
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`📊 Query executed in ${duration}ms`, { text: text.substring(0, 50), rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
};

// Transaction wrapper for atomic operations
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Transaction failed, rolling back:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  query,
  transaction,
  pool
};
