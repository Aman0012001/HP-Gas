const fs = require('fs');
const path = require('path');
const pool = require('./db');

const schemaFiles = [
    path.join(__dirname, '..', 'database_v2.sql'),
    path.join(__dirname, 'schema_sms.sql'),
];

async function initDb() {
    const client = await pool.connect();
    try {
        for (const filePath of schemaFiles) {
            const sql = fs.readFileSync(filePath, 'utf8');
            await client.query(sql);
            console.log(`Schema applied successfully: ${path.basename(filePath)}`);
        }
        console.log('Database initialization complete.');
    } catch (err) {
        console.error('Database initialization failed:', err.message);
        throw err;
    } finally {
        client.release();
    }
}

module.exports = initDb;
