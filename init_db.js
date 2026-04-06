const { Pool } = require('pg');

const pool = new Pool({
  host: 'maglev.proxy.rlwy.net',
  user: 'postgres',
  password: 'vRQEIQuHmdyLyOzvRYYtPtNiFpJtWlPb',
  port: 30477,
  database: 'railway',
  ssl: {
    rejectUnauthorized: false
  }
});

const schema = `
-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    mobile_number TEXT UNIQUE NOT NULL,
    address TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    provider TEXT NOT NULL,
    consumer_number TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    delivery_date TIMESTAMP WITH TIME ZONE
);

-- 3. Create SMS Logs Table
CREATE TABLE IF NOT EXISTS sms_logs (
    id SERIAL PRIMARY KEY,
    sender VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile_number);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_sender ON sms_logs(sender);
CREATE INDEX IF NOT EXISTS idx_sms_received_at ON sms_logs(received_at);
`;

async function runMigration() {
  console.log('--- STARTING DATABASE INITIALIZATION ---');
  try {
    const client = await pool.connect();
    console.log('CONNECTED to Railway PostgreSQL');
    
    await client.query(schema);
    console.log('SUCCESS: All tables (users, bookings, sms_logs) and indexes created.');
    
    // Verify
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('CURRENT TABLES:', res.rows.map(r => r.table_name).join(', '));
    
    client.release();
  } catch (err) {
    console.error('ERROR INITIALIZING DATABASE:', err.message);
  } finally {
    await pool.end();
    console.log('--- DATABASE INITIALIZATION FINISHED ---');
  }
}

runMigration();
