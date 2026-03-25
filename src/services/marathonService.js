// Mock database layer (Replace with actual DB soon)
const mockRegistrations = [];

const getEventInfo = async () => {
    return {
        eventName: 'CHOMBUENG MARATHON 2026',
        date: '2026-12-20',
        location: 'มหาวิทยาลัยราชภัฏหมู่บ้านจอมบึง',
        categories: [
            { id: '42k', name: 'มาราธอน 42.195 กม.', price: 1200 },
            { id: '21k', name: 'ฮาล์ฟมาราธอน 21.1 กม.', price: 900 },
            { id: '10k', name: 'มินิมาราธอน 10 กม.', price: 600 }
        ]
    };
};

const createRegistration = async (data) => {
    if (!data.name || !data.category) {
        throw new Error('Name and category are required');
    }
    const newReg = {
        id: Date.now().toString(),
        ...data,
        status: 'pending_payment',
        createdAt: new Date().toISOString()
    };
    mockRegistrations.push(newReg);
    return newReg;
};

const getAllRegistrations = async () => {
    return mockRegistrations;
};

const getStats = async () => {
    return {
        totalRegistrations: mockRegistrations.length,
        revenue: mockRegistrations.length * 900 // Mock revenue logic
    };
};

module.exports = {
    getEventInfo,
    createRegistration,
    getAllRegistrations,
    getStats
};
