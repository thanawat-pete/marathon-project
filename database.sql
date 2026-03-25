-- Database Schema for Chombueng Marathon 2026

CREATE DATABASE IF NOT EXISTS chombueng_marathon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE chombueng_marathon;

-- Runners Table
CREATE TABLE IF NOT EXISTS runners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    category VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending_payment',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a default admin user (password format will be handled by bcrypt in Node.js, 
-- but for initial setup we can just have a placeholder or use a node script to create it.
-- We'll just define the structure here, and create the first admin via a one-time API or script later.
-- To keep it simple, let's assume we'll hash 'admin123' and insert it.
-- Hash of 'admin123' using bcrypt with salt rounds 10 is:
-- $2a$10$wE/.76Mfw1J1HkQdC6XyBODx0n5tJ5D/YhRzjL6.N2o2S.uP5hWzG
INSERT IGNORE INTO admins (username, password_hash) VALUES ('admin', '$2a$10$wE/.76Mfw1J1HkQdC6XyBODx0n5tJ5D/YhRzjL6.N2o2S.uP5hWzG');
