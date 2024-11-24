const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwtUtil = require('../config/jwt.js');
const authService = require('../services/authService.js');
const logger = require('../utils/logger.js');
const asyncHandler = require("../middlewares/asyncHandler");
const successRedirectUrl = process.env.GOOGLE_SUCCESS_REDIRECT_URL;
const failureRedirectUrl = process.env.GOOGLE_FAILURE_REDIRECT_URL;
const crypto = require('crypto');
const { encrypt, decrypt } = require('../utils/encryption');

/**
 * @api {get} /auth/google 01.Google 登入
 * @apiName GoogleLogin
 * @apiGroup 01.登入模組
 * @apiSuccess {String} message 登入成功
 */
router.get('/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        prompt: 'select_account' // 強制顯示帳號選擇
    })
);

/**
 * @api {get} /auth/google/callback 02.Google 登入回調
 * @apiName GoogleCallback
 * @apiGroup 01.登入模組
 * @apiSuccess {String} message 登入成功
 */
router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: failureRedirectUrl,
        session: true 
    }),
    async (req, res) => {
        try {
            const result = await authService.handleGoogleLogin(req);
            logger.info('Google 登入成功，用戶資料:', {
                userId: result.user?.id,
                email: result.user?.email
            });
            
            // 將結果存入 session
            req.session.auth = {
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    name: result.user.name,
                    role: result.user.role
                },
                token: result.accessToken,
                isAuthenticated: true,
                loginTime: new Date().toISOString()
            };
            
            // 使用 Promise 包裝 session 保存
            await new Promise((resolve, reject) => {
                req.session.save((err) => {
                    if (err) {
                        logger.error('Session 保存錯誤:', err);
                        reject(new Error('Session 保存失敗'));
                    }
                    resolve();
                });
            });
            
            // 構建重定向 URL
            const redirectUrl = new URL(successRedirectUrl);
            redirectUrl.searchParams.append('login_success', 'true');
            redirectUrl.searchParams.append('token', result.accessToken);
            
            // 記錄重定向信息
            logger.info('重定向到:', redirectUrl.toString());
            
            // 執行重定向
            res.redirect(redirectUrl.toString());
            
        } catch (error) {
            logger.error('登入回調錯誤:', error);
            
            // 確保清理 session
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
            } catch (cleanupError) {
                logger.error('清理 session 時發生錯誤:', cleanupError);
            }
            
            // 構建錯誤重定向 URL
            const errorUrl = new URL(failureRedirectUrl);
            errorUrl.searchParams.append('error', encodeURIComponent(error.message || '登入失敗'));
            
            // 記錄錯誤重定向
            logger.info('錯誤重定向到:', errorUrl.toString());
            
            res.redirect(errorUrl.toString());
        }
    }
);

/**
 * @api {get} /auth/logout 03.登出
 * @apiName Logout
 * @apiGroup 01.登入模組
 * @apiSuccess {String} message 登出成功
 */
router.get('/logout', async (req, res) => {
    try {
        const result = await authService.handleLogout(req.logout.bind(req));
        res.json(result);
    } catch (error) {
        res.status(500).json({
            message: '登出失敗',
            error: error.message
        });
    }
});

/*
 * @api {post} /auth/get-token 開發測試用取得 token 的 API
 * @apiName GetToken
 * @apiGroup 01.登入模組
 * @apiParam {String} email 用戶Email
 * @apiSuccess {String} token 登入 token
 */
router.post('/get-token', 
    asyncHandler(async (req, res) => {
        const result = await authService.getToken(req.body.email);
        res.json(result);
}));

/**
 * @api {get} /auth/session 獲取當前 session 狀態
 * @apiName GetSession
 * @apiGroup 01.登入模組
 */
router.get('/session', 
    asyncHandler(async (req, res) => {
        const result = await authService.getSessionStatus(req.session);
        res.json(result);
    })
);

module.exports = router; 