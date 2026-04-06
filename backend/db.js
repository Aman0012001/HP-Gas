const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Railway and modern cloud DBs
  }
});

pool.on('connect', () => {
    console.log('Connected to PostgreSQL Database pool');
});

pool.on('error', (err) => {
    console.error('Unexpected error on pool connection:', err);
    process.exit(-1);
});

module.exports = pool;
