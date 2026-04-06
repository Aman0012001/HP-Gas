-- 1. Create SMS Logs Table
CREATE TABLE IF NOT EXISTS sms_logs (
    id SERIAL PRIMARY KEY,
    sender VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Performance Optimization
-- Index on sender for fast searching/filtering
CREATE INDEX idx_sms_sender ON sms_logs(sender);
-- Index on received_at for timestamp-based queries (e.g. last 24h)
CREATE INDEX idx_sms_received_at ON sms_logs(received_at);
