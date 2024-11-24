const logger = require('../utils/logger');
const JwtService = require('../config/jwt');

class AuthService {
    /**
     * 處理 Google 登入成功後的邏輯
     * @param {Object} user - 用戶對象
     * @param {Object} req - Express 請求對象
     * @returns {Object} 包含用戶信息和 token 的對象
     */
    async handleGoogleLogin(user, req) {
        try {
            // 獲取登入信息
            const loginInfo = {
                ip: req.ip,
                userAgent: req.headers['user-agent'],
                deviceInfo: JwtService.parseUserAgent(req.headers['user-agent'])
            };

            // 創建登入記錄
            await user.createLoginRecord({
                ip_address: loginInfo.ip,
                user_agent: loginInfo.userAgent,
                device_info: loginInfo.deviceInfo
            });

            // 生成令牌對
            const tokens = JwtService.generateTokenPair(user);

            // 返回用戶信息和令牌
            return {
                success: true,
                message: '登入成功',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar_url: user.avatar_url
                },
                ...tokens  // 包含 accessToken 和 refreshToken
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
                    resolve({ 
                        success: true,
                        message: '登出成功' 
                    });
                }
            });
        });
    }

    /**
     * 刷新訪問令牌
     * @param {string} refreshToken - 刷新令牌
     * @returns {Promise<Object>} 新的令牌對
     */
    async refreshToken(refreshToken) {
        try {
            // 驗證刷新令牌
            const decoded = JwtService.verifyToken(refreshToken);
            
            // 檢查用戶是否存在
            const user = await User.findByPk(decoded.userId);
            if (!user) {
                throw new Error('用戶不存在');
            }

            // 生成新的令牌對
            const tokens = JwtService.generateTokenPair(user);

            return {
                success: true,
                message: '令牌刷新成功',
                ...tokens
            };
        } catch (error) {
            logger.error('刷新令牌錯誤:', error);
            throw error;
        }
    }
}

module.exports = new AuthService(); 