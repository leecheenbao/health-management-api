const logger = require('../utils/logger');
const JwtService = require('../config/jwt');
const ApiError = require('../utils/apiError');
const { User } = require('../models');
const { encrypt } = require('../utils/encryption');

class AuthService {
    /**
     * 處理 Google 登入回調
     * @param {Object} req Express 請求對象
     * @param {Object} res Express 響應對象
     * @returns {Promise<void>}
     */
    async handleGoogleCallback(req, res) {
        try {
            const data = req;

            // 處理 Google 登入
            logger.info('Google 登入成功，用戶資料:', {
                userId: data.user?.id,
                email: data.user?.email
            });
            
            // 構建 session 數據
            const sessionData = {
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.name,
                    role: data.user.role
                },
                token: data.accessToken,
                isAuthenticated: true,
                loginTime: new Date().toISOString()
            };

            // 保存 session
            await this.saveSession(req, sessionData);
            
            // 構建並返回重定向 URL
            return this.buildSuccessRedirect(data.accessToken);

        } catch (error) {
            logger.error('Google 登入回調處理失敗:', error);
            
            // 清理 session 和登出
            await this.cleanupSession(req);
            
            // 返回錯誤重定向 URL
            return this.buildErrorRedirect(error.message);
        }
    }

    /**
     * 保存 session 數據
     * @param {Object} req Express 請求對象
     * @param {Object} sessionData session 數據
     * @returns {Promise<void>}
     */
    async saveSession(req, sessionData) {
        return new Promise((resolve, reject) => {
            req.session.auth = sessionData;
            req.session.save((err) => {
                if (err) {
                    logger.error('Session 保存錯誤:', err);
                    reject(new Error('Session 保存失敗'));
                }
                logger.info('Session 保存成功');
                resolve();
            });
        });
    }

    /**
     * 清理 session 和登出
     * @param {Object} req Express 請求對象
     * @returns {Promise<void>}
     */
    async cleanupSession(req) {
        try {
            if (req.session) {
                await new Promise((resolve) => {
                    req.session.destroy((err) => {
                        if (err) logger.error('Session 清理錯誤:', err);
                        resolve();
                    });
                });
            }
            
            if (req.logout) {
                await new Promise((resolve) => {
                    req.logout((err) => {
                        if (err) logger.error('登出錯誤:', err);
                        resolve();
                    });
                });
            }
        } catch (error) {
            logger.error('清理 session 時發生錯誤:', error);
            throw error;
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
        
        logger.info('構建成功重定向 URL:', redirectUrl.toString());
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
        
        logger.info('構建錯誤重定向 URL:', errorUrl.toString());
        return errorUrl.toString();
    }

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

    /**
     * 獲取當前 session 狀態
     * @param {Object} session Express session 對象
     * @returns {Object} 加密後的 session 狀態
     */
    async getSessionStatus(session) {
        try {
            if (session?.auth?.isAuthenticated) {
                // 準備認證用戶的 session 數據
                const sessionData = {
                    isAuthenticated: true,
                    user: session.auth.user,
                    token: session.auth.token,
                    timestamp: new Date().toISOString()
                };

                // 加密數據
                const encryptedData = encrypt(JSON.stringify(sessionData));

                return {
                    success: true,
                    data: encryptedData
                };
            } else {
                // 準備未認證用戶的 session 數據
                const sessionData = {
                    isAuthenticated: false,
                    timestamp: new Date().toISOString()
                };

                // 加密數據
                const encryptedData = encrypt(JSON.stringify(sessionData));

                return {
                    success: false,
                    data: encryptedData
                };
            }
        } catch (error) {
            logger.error('獲取 session 狀態失敗:', error);
            throw new Error('獲取 session 狀態失敗');
        }
    }
}

module.exports = new AuthService(); 