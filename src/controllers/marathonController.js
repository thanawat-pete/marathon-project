const marathonService = require('../services/marathonService');

const getMarathonInfo = async (req, res) => {
    try {
        const info = await marathonService.getEventInfo();
        res.json({ success: true, data: info });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const registerRunner = async (req, res) => {
    try {
        const registrationData = req.body;
        // Validate data here...
        const result = await marathonService.createRegistration(registrationData);
        res.status(201).json({ success: true, data: result, message: 'Registration successful' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getAllRegistrations = async (req, res) => {
    try {
        const registrations = await marathonService.getAllRegistrations();
        res.json({ success: true, data: registrations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const stats = await marathonService.getStats();
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getMarathonInfo,
    registerRunner,
    getAllRegistrations,
    getDashboardStats
};
