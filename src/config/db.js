const path = require('path');
const bcrypt = require('bcrypt');

let dbInstance = null;
let isPostgres = !!(process.env.DATABASE_URL || process.env.POSTGRES_URL);
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

// Synchronously initialize Postgres Pool for serverless environments (Vercel)
if (isPostgres) {
    const { Pool } = require('pg');
    dbInstance = new Pool({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });
    console.log('Postgres Pool initialized with ' + (process.env.DATABASE_URL ? 'DATABASE_URL' : 'POSTGRES_URL'));
}

const connectDB = async () => {
    try {
        if (isPostgres) {
            // Postgres schema should be managed externally
            return;
        } else {
            // SQLite (Local Development)
            const sqlite3 = require('sqlite3').verbose();
            const { open } = require('sqlite');
            const dbFile = path.resolve(__dirname, '../../database.sqlite');
            dbInstance = await open({
                filename: dbFile,
                driver: sqlite3.Database
            });
            console.log('SQLite database connected successfully!');

            // SQLite table creation logic (Keeping it for local dev)
            await dbInstance.exec(`
                CREATE TABLE IF NOT EXISTS RUNNER (
                    runner_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    first_name TEXT NOT NULL, last_name TEXT NOT NULL, date_of_birth DATE, gender TEXT, citizen_id TEXT UNIQUE, phone TEXT, email TEXT, address TEXT, is_disabled BOOLEAN DEFAULT 0
                );
                CREATE TABLE IF NOT EXISTS RACE_CATEGORY (
                    category_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, distance_km REAL, start_time TEXT, time_limit TEXT, giveaway_type TEXT
                );
                CREATE TABLE IF NOT EXISTS AGE_GROUP (
                    group_id INTEGER PRIMARY KEY AUTOINCREMENT, category_id INTEGER, gender TEXT, min_age INTEGER, max_age INTEGER, label TEXT,
                    FOREIGN KEY(category_id) REFERENCES RACE_CATEGORY(category_id)
                );
                CREATE TABLE IF NOT EXISTS PRICE_RATE (
                    price_id INTEGER PRIMARY KEY AUTOINCREMENT, category_id INTEGER, runner_type TEXT, amount REAL,
                    FOREIGN KEY(category_id) REFERENCES RACE_CATEGORY(category_id)
                );
                CREATE TABLE IF NOT EXISTS SHIPPING_OPTION (
                    shipping_id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, cost REAL, detail TEXT
                );
                CREATE TABLE IF NOT EXISTS REGISTRATION (
                    reg_id INTEGER PRIMARY KEY AUTOINCREMENT, runner_id INTEGER, category_id INTEGER, price_id INTEGER, shipping_id INTEGER, reg_date DATETIME DEFAULT CURRENT_TIMESTAMP, shirt_size TEXT, bib_number TEXT, status TEXT DEFAULT 'Pending' COLLATE NOCASE,
                    FOREIGN KEY(runner_id) REFERENCES RUNNER(runner_id), FOREIGN KEY(category_id) REFERENCES RACE_CATEGORY(category_id), FOREIGN KEY(price_id) REFERENCES PRICE_RATE(price_id), FOREIGN KEY(shipping_id) REFERENCES SHIPPING_OPTION(shipping_id)
                );
                CREATE TABLE IF NOT EXISTS PAYMENT (
                    payment_id INTEGER PRIMARY KEY AUTOINCREMENT, reg_id INTEGER, total_amount REAL, payment_time DATETIME, payment_method TEXT, status TEXT,
                    FOREIGN KEY(reg_id) REFERENCES REGISTRATION(reg_id)
                );
                CREATE TABLE IF NOT EXISTS admins (
                    id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            `);

            // Seed Admin & Basic Data
            const adminExists = await dbInstance.get('SELECT * FROM admins WHERE username = ?', ['admin']);
            if (!adminExists) {
                const hash = await bcrypt.hash('admin123', 10);
                await dbInstance.run('INSERT INTO admins (username, password_hash) VALUES (?, ?)', ['admin', hash]);
                
                // Seed generic categories if empty
                const catCount = await dbInstance.get('SELECT COUNT(*) as count FROM RACE_CATEGORY');
                if (catCount.count === 0) {
                    await dbInstance.run('INSERT INTO RACE_CATEGORY (name, distance_km) VALUES (?, ?)', ['มาราธอน 42.195 กม.', 42.195]);
                    await dbInstance.run('INSERT INTO PRICE_RATE (category_id, runner_type, amount) VALUES (1, "Standard", 1200)');
                    await dbInstance.run('INSERT INTO SHIPPING_OPTION (type, cost, detail) VALUES ("EMS", 90, "จัดส่งไปรษณีย์")');
                }
            }
        }
    } catch (err) {
        console.error('Database connection failed:', err);
    }
};

const getDB = () => {
    if (!dbInstance) throw new Error('Database not initialized!');
    return {
        instance: dbInstance,
        isPostgres,
        // Abstraction helper for common operations
        query: async (sql, params = []) => {
            if (isPostgres) {
                // Postgres uses $1, $2, ... but our code uses ?
                // Convert ? to $1, $2, etc.
                let i = 1;
                const pgSql = sql.replace(/\?/g, () => `$${i++}`);
                const result = await dbInstance.query(pgSql, params);
                return result.rows;
            } else {
                return await dbInstance.all(sql, params);
            }
        },
        get: async (sql, params = []) => {
            try {
                if (isPostgres) {
                    let i = 1;
                    const pgSql = sql.replace(/\?/g, () => `$${i++}`);
                    const result = await dbInstance.query(pgSql, params);
                    return result.rows[0];
                } else {
                    return await dbInstance.get(sql, params);
                }
            } catch (err) {
                console.error('DB Get Error:', err.message, 'SQL:', sql);
                throw err;
            }
        },
        run: async (sql, params = []) => {
            if (isPostgres) {
                let i = 1;
                // Add RETURNING if it's an INSERT to get the ID
                let pgSql = sql.replace(/\?/g, () => `$${i++}`);
                if (pgSql.trim().toUpperCase().startsWith('INSERT')) {
                    pgSql += ' RETURNING *';
                }
                const result = await dbInstance.query(pgSql, params);
                // In Postgres, returning * makes the first row the newly inserted record
                const row = result.rows[0];
                return { 
                    lastID: row ? (row.runner_id || row.reg_id || row.payment_id || row.id) : 0, 
                    changes: result.rowCount 
                };
            } else {
                const result = await dbInstance.run(sql, params);
                return result;
            }
        }
    };
};

module.exports = { connectDB, getDB };
