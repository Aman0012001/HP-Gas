-- 1. Devices Table
CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(100) UNIQUE NOT NULL,
    first_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    app_version VARCHAR(20)
);

-- 2. Updated SMS Logs Table
CREATE TABLE IF NOT EXISTS sms_logs (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(100) NOT NULL REFERENCES devices(device_id),
    sender VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Admin Users Table (For Dashboard Access)
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Production Performance Indexes
CREATE INDEX IF NOT EXISTS idx_sms_device_id ON sms_logs(device_id);
CREATE INDEX IF NOT EXISTS idx_sms_sender ON sms_logs(sender);
CREATE INDEX IF NOT EXISTS idx_sms_received_at ON sms_logs(received_at);
CREATE INDEX IF NOT EXISTS idx_devices_last_seen ON devices(last_seen);
