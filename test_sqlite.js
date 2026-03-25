const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function test() {
    try {
        const dbFile = path.resolve(__dirname, 'database.sqlite');
        const db = await open({
            filename: dbFile,
            driver: sqlite3.Database
        });
        
        try {
            const name = 'Test', email = 'test', phone = '123', category = '10k', status = 'pending';
            await db.run(
                'INSERT INTO runners (name, email, phone, category, status) VALUES (?, ?, ?, ?, ?)',
                [name, email || null, phone || null, category, status]
            );
            console.log("INSERT WORKED");
        } catch (e) {
            console.log("CAUGHT ERROR:", e);
        }

    } catch(e) {
        console.error("FATAL", e);
    }
}
test();
