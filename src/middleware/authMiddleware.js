const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized. Token required.' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'chombueng-marathon-secret-key';

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded; // { id, username, role, ... }
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};

module.exports = {
    requireAuth
};
