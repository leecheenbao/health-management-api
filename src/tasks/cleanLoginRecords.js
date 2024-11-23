const { LoginRecord } = require('../models');
const { Op } = require('sequelize');

async function cleanOldLoginRecords() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
        await LoginRecord.destroy({
            where: {
                login_at: {
                    [Op.lt]: thirtyDaysAgo
                }
            }
        });
    } catch (error) {
        console.error('清理登入記錄失敗:', error);
    }
}

module.exports = cleanOldLoginRecords; 