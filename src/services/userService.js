const { User, LoginRecord } = require('../models');
const bcrypt = require('bcryptjs');
const JwtService = require('../config/jwt');
const ApiError = require('../utils/ApiError');
const { Op } = require('sequelize');

class UserService {

    /**
     * 取得登入紀錄
     * @param {number} userId - 用戶ID
     * @returns {Promise<User>}
     */
    static async getLoginRecords(userId, pagination) {
        const loginRecords = await LoginRecord.findAndCountAll(
            { where: { user_id: userId }, ...pagination }
        );
        return loginRecords;
    }
    
} 