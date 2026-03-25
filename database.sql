-- Database Schema for Chombueng Marathon 2026 (PostgreSQL & SQLite compatible)

-- 1. Race Categories
CREATE TABLE IF NOT EXISTS RACE_CATEGORY (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    distance_km DECIMAL(10,3),
    start_time VARCHAR(50),
    time_limit VARCHAR(50),
    giveaway_type VARCHAR(100)
);

-- 2. Price Rates (Standard vs Member etc.)
CREATE TABLE IF NOT EXISTS PRICE_RATE (
    price_id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES RACE_CATEGORY(category_id),
    runner_type VARCHAR(50) DEFAULT 'Standard',
    amount DECIMAL(10,2) NOT NULL
);

-- 3. Shipping Options
CREATE TABLE IF NOT EXISTS SHIPPING_OPTION (
    shipping_id SERIAL PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    cost DECIMAL(10,2) DEFAULT 0,
    detail TEXT
);

-- 4. Runners (Personal Info)
CREATE TABLE IF NOT EXISTS RUNNER (
    runner_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    gender CHAR(1),
    citizen_id VARCHAR(20) UNIQUE,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    is_disabled BOOLEAN DEFAULT FALSE
);

-- 5. Registrations
CREATE TABLE IF NOT EXISTS REGISTRATION (
    reg_id SERIAL PRIMARY KEY,
    runner_id INTEGER REFERENCES RUNNER(runner_id),
    category_id INTEGER REFERENCES RACE_CATEGORY(category_id),
    price_id INTEGER REFERENCES PRICE_RATE(price_id),
    shipping_id INTEGER REFERENCES SHIPPING_OPTION(shipping_id),
    reg_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    shirt_size VARCHAR(10),
    bib_number VARCHAR(20),
    status VARCHAR(50) DEFAULT 'Pending'
);

-- 6. Payments
CREATE TABLE IF NOT EXISTS PAYMENT (
    payment_id SERIAL PRIMARY KEY,
    reg_id INTEGER REFERENCES REGISTRATION(reg_id),
    total_amount DECIMAL(10,2) NOT NULL,
    payment_time TIMESTAMP WITH TIME ZONE,
    payment_method VARCHAR(100) DEFAULT 'Bank Transfer',
    status VARCHAR(50) DEFAULT 'Pending'
);

-- 7. Admins
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Basic Data
INSERT INTO RACE_CATEGORY (name, distance_km, giveaway_type) VALUES 
('มาราธอน 42.195 กม.', 42.195, 'Finisher Shirt + Medal'),
('ฮาล์ฟมาราธอน 21.1 กม.', 21.1, 'Medal'),
('มินิมาราธอน 10 กม.', 10.0, 'Medal');

INSERT INTO PRICE_RATE (category_id, runner_type, amount) VALUES 
(1, 'Standard', 1200),
(2, 'Standard', 900),
(3, 'Standard', 600);

INSERT INTO SHIPPING_OPTION (type, cost, detail) VALUES 
('Pick up', 0, 'รับด้วยตนเอง (หน้างาน)'),
('EMS', 90, 'จัดส่งแบบด่วน (ชำระเพิ่ม 90 บาท)');

INSERT INTO admins (username, password_hash) 
VALUES ('admin', '$2a$10$wE/.76Mfw1J1HkQdC6XyBODx0n5tJ5D/YhRzjL6.N2o2S.uP5hWzG')
ON CONFLICT (username) DO NOTHING;
