const { getDB } = require('../config/db');

const getEventInfo = async () => {
    return {
        eventName: 'CHOMBUENG MARATHON 2026',
        date: '2026-12-20',
        location: 'มหาวิทยาลัยราชภัฏหมู่บ้านจอมบึง',
    };
};

const getFormConfig = async () => {
    const db = getDB();
    const categories = await db.query(`
        SELECT c.category_id, c.name, c.distance_km, c.giveaway_type, p.price_id, p.amount 
        FROM RACE_CATEGORY c 
        JOIN PRICE_RATE p ON c.category_id = p.category_id 
        WHERE p.runner_type = 'Standard'
    `);
    const shippingOptions = await db.query('SELECT * FROM SHIPPING_OPTION');
    
    return { categories, shippingOptions };
};

const createRegistration = async (data) => {
    const { 
        first_name, last_name, date_of_birth, gender, citizen_id, phone, email, address, is_disabled,
        category_id, price_id, shipping_id, shirt_size
    } = data;

    if (!first_name || !last_name || !category_id || !shipping_id || !price_id) {
        throw new Error('Required fields are missing');
    }

    const db = getDB();
    let runnerId;

    if (citizen_id) {
        const existing = await db.get('SELECT runner_id FROM RUNNER WHERE citizen_id = ?', [citizen_id]);
        if (existing) {
            runnerId = existing.runner_id;
            await db.run(
                'UPDATE RUNNER SET first_name=?, last_name=?, date_of_birth=?, gender=?, phone=?, email=?, address=? WHERE runner_id=?',
                [first_name, last_name, date_of_birth, gender, phone, email, address, runnerId]
            );
        }
    }

    if (!runnerId) {
        const runRes = await db.run(
            'INSERT INTO RUNNER (first_name, last_name, date_of_birth, gender, citizen_id, phone, email, address, is_disabled) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, date_of_birth || null, gender, citizen_id || null, phone, email, address, !!is_disabled]
        );
        runnerId = runRes.lastID;
    }

    const bib_number = Math.floor(Math.random() * 90000) + 10000;

    const regRes = await db.run(
        'INSERT INTO REGISTRATION (runner_id, category_id, price_id, shipping_id, shirt_size, bib_number, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [runnerId, category_id, price_id, shipping_id, shirt_size, bib_number, 'Pending']
    );
    const regId = regRes.lastID;

    const price = await db.get('SELECT amount FROM PRICE_RATE WHERE price_id = ?', [price_id]);
    const shipping = await db.get('SELECT cost FROM SHIPPING_OPTION WHERE shipping_id = ?', [shipping_id]);
    const total_amount = (price ? price.amount : 0) + (shipping ? shipping.cost : 0);

    await db.run(
        'INSERT INTO PAYMENT (reg_id, total_amount, payment_time, payment_method, status) VALUES (?, ?, ?, ?, ?)',
        [regId, total_amount, null, 'Bank Transfer', 'Pending']
    );

    return {
        reg_id: regId,
        runner_id: runnerId,
        bib_number,
        total_amount,
        status: 'Pending'
    };
};

const getAllRegistrations = async () => {
    const db = getDB();
    const rows = await db.query(`
        SELECT 
            reg.reg_id as id,
            r.first_name || ' ' || r.last_name as name,
            r.email,
            r.phone,
            c.name as category,
            reg.reg_date as created_at,
            pay.total_amount
        FROM REGISTRATION reg
        JOIN RUNNER r ON reg.runner_id = r.runner_id
        JOIN RACE_CATEGORY c ON reg.category_id = c.category_id
        LEFT JOIN PAYMENT pay ON reg.reg_id = pay.reg_id
        ORDER BY reg.reg_date DESC
    `);
    
    return rows;
};

const getStats = async () => {
    const db = getDB();
    const row = await db.get('SELECT COUNT(*) as total FROM REGISTRATION');
    const totalRegistrations = row ? row.total : 0;
    const revRow = await db.get('SELECT SUM(total_amount) as total_rev FROM PAYMENT');
    const revenue = revRow ? (revRow.total_rev || 0) : 0; 

    return {
        totalRegistrations,
        revenue
    };
};

module.exports = {
    getEventInfo,
    getFormConfig,
    createRegistration,
    getAllRegistrations,
    getStats
};
