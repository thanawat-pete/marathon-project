const requireAuth = (req, res, next) => {
    // Simple mock authentication middleware
    const token = req.headers.authorization;
    
    // In a real app, verify JWT here
    if (token && token === 'Bearer admin-secret-token') {
        req.user = { role: 'admin' };
        next();
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized access. Admin token required.' });
    }
};

module.exports = {
    requireAuth
};
