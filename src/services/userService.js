const { User, LoginRecord } = require('../models');
const { Op } = require('sequelize');
const { ApiError } = require('../utils/apiError');
const logger = require('../utils/logger');

class UserService {
    
    /**
     * 編輯用戶資料
     */
    static async updateUser(userId, data) {

        // 驗證欄位
        const { name, hospital, doctor_name } = data;

        if (!name || !hospital || !doctor_name) {
            throw new ApiError(200, '請填寫完整個人資料');
        }

        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new ApiError(200, '用戶不存在');
            }
            return user.update(data);
        } catch (error) {
            logger.error('編輯用戶資料失敗:', error);
            throw new ApiError(500, '編輯用戶資料失敗');
        }
    }

    /**
     * 退出計劃
     */
    static async quitPlan(userId) {
        try {
            await User.update({ is_active: false }, { where: { id: userId } });
            return { message: '退出計劃成功' };
        } catch (error) {
            logger.error('退出計劃失敗:', error);
            throw new ApiError(500, '退出計劃失敗');
        }
    }

    /**
     * 獲取用戶登入歷史
     * @param {number} userId - 用戶ID
     * @param {Object} options - 分頁選項
     * @returns {Promise<Object>} 登入記錄和分頁信息
     */
    static async getLoginHistory(userId, options = {}) {
        const { page = 1, limit = 10 } = options;
        const offset = (page - 1) * limit;

        try {
            const { count, rows } = await LoginRecord.findAndCountAll({
                where: { user_id: userId },
                order: [['created_at', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset),
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email']
                }]
            });

            return {
                records: rows,
                total: count,
                page: parseInt(page),
                totalPages: Math.ceil(count / limit)
            };
        } catch (error) {
            logger.error('獲取登入歷史失敗:', error);
            throw new ApiError(500, '獲取登入歷史失敗');
        }
    }

    // ... 其他方法 ...
}

module.exports = UserService;