const logger = require('../utils/logger');
const jwtUtil = require('../config/jwt.js');

class AuthService {
    /**
     * 處理 Google 登入成功後的邏輯
     * @param {Object} user - 用戶對象
     * @param {Object} req - Express 請求對象
     * @returns {Object} 包含用戶信息和 token 的對象
     */
    async handleGoogleLogin(user, req) {
        try {

            // 生成 JWT token
            const token = jwtUtil.sign({ 
                userId: user.id,
                email: user.email 
            });

            console.log('token', token);
            // 創建登入記錄
            await user.createLoginRecord(req);

            // 返回用戶信息和 token
            return {
                message: '登入成功',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar_url: user.avatar_url
                },
                token
            };
        } catch (error) {
            logger.error('Google 登入處理錯誤:', error);
            throw error;
        }
    }

    /**
     * 處理登出邏輯
     * @param {Function} logoutFn - Express 登出函數
     * @returns {Promise} 登出結果
     */
    async handleLogout(logoutFn) {
        return new Promise((resolve, reject) => {
            logoutFn((err) => {
                if (err) {
                    logger.error('登出錯誤:', err);
                    reject(err);
                } else {
                    resolve({ message: '登出成功' });
                }
            });
        });
    }
}

module.exports = new AuthService(); 