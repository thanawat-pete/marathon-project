const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getDB } = require('../config/db');

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    try {
        const db = getDB();
        const user = await db.get('SELECT * FROM admins WHERE username = ?', [username]);
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const secret = process.env.JWT_SECRET || 'chombueng-marathon-secret-key';
        const token = jwt.sign({ id: user.id, username: user.username, role: 'admin' }, secret, { expiresIn: '1d' });

        res.json({
            success: true,
            message: 'Login successful',
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

module.exports = {
    login
};
