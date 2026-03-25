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
        const result = await marathonService.createRegistration(req.body);
        res.status(201).json({ success: true, data: result, message: 'Registration successful' });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(400).json({ success: false, message: error.message || String(error) });
    }
};

const getConfig = async (req, res) => {
    try {
        const config = await marathonService.getFormConfig();
        res.json({ success: true, data: config });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
    getConfig,
    registerRunner,
    getAllRegistrations,
    getDashboardStats
};
