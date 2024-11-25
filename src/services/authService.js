const logger = require('../utils/logger');
const JwtService = require('../config/jwt');
const ApiError = require('../utils/apiError');
const { User } = require('../models');
const { encrypt } = require('../utils/encryption');

class AuthService {

    /**
     * 處理 Google 登入成功後的邏輯
     * @param {Object} user - 用戶對象
     * @param {Object} req - Express 請求對象
     * @returns {Object} 包含用戶信息和 token 的對象
     */
    async handleGoogleLogin(req) {
        try {
            if (!req.user) {
                throw new ApiError(200, '用戶不存在');
            }
            // 獲取登入信息
            const loginInfo = {
                ip: req.ip,
                userAgent: req.headers['user-agent'],
                deviceInfo: JwtService.parseUserAgent(req.headers['user-agent'])
            };

            // 檢查用戶是否存在
            const user = await User.findByPk(req.user.id);
            if (!user) {
                throw new ApiError(200, '用戶不存在');
            }

            // 創建登入記錄
            await user.createLoginRecord({
                ip_address: loginInfo.ip,
                user_agent: loginInfo.userAgent,
                device_info: loginInfo.deviceInfo
            });

            // 生成令牌對
            const tokens = JwtService.generateTokenPair(user);
            // 構建並返回重定向 URL
            return this.buildSuccessRedirect(tokens.accessToken);

        } catch (error) {
            logger.error('Google 登入處理錯誤:', error);
            return this.buildErrorRedirect(error.message);
        }
    }

    /**
     * 構建成功重定向 URL
     * @param {string} token 訪問令牌
     * @returns {string} 重定向 URL
     */
    buildSuccessRedirect(token) {
        const redirectUrl = new URL(process.env.GOOGLE_SUCCESS_REDIRECT_URL);
        redirectUrl.searchParams.append('login_success', 'true');
        redirectUrl.searchParams.append('token', token);
        
        return redirectUrl.toString();
    }

    /**
     * 構建錯誤重定向 URL
     * @param {string} errorMessage 錯誤信息
     * @returns {string} 重定向 URL
     */
    buildErrorRedirect(errorMessage) {
        const errorUrl = new URL(process.env.GOOGLE_FAILURE_REDIRECT_URL);
        errorUrl.searchParams.append('error', encodeURIComponent(errorMessage || '登入失敗'));
        
        return errorUrl.toString();
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
                throw new ApiError(200, '用戶不存在');
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

    /**
     * 取得 token
     * @param {string} email - 用戶Email
     * @returns {Promise<Object>} 包含 token 的對象
     */
    async getToken(email) {
        try {
            const user = await User.findOne({ 
                where: { email },
            });
            
            if (!user) {
                throw new ApiError(200, '用戶不存在');
            }
            const token = JwtService.generateAccessToken({ id: user.id });
            return {
                success: true,
                message: '取得 token 成功',
                data: {
                    token
                }   
            };
        } catch (error) {
            logger.error('取得 token 錯誤:', error);
            throw error;
        }
    }
}

module.exports = new AuthService(); 