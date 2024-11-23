const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwtUtil = require('../config/jwt.js');
const authService = require('../services/authService.js');
const logger = require('../utils/logger.js');

/**
 * @api {get} /auth/google Google 登入
 * @apiName GoogleLogin
 * @apiGroup 01.登入
 * @apiSuccess {String} message 登入成功
 */
router.get('/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        prompt: 'select_account' // 強制顯示帳號選擇
    })
);

/**
 * @api {get} /auth/google/callback Google 登入回調
 * @apiName GoogleCallback
 * @apiGroup 01.登入
 * @apiSuccess {String} message 登入成功
 */
router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/login',
        session: true 
    }),
    async (req, res) => {
        try {
            const result = await authService.handleGoogleLogin(req.user, req);
            res.json(result);
        } catch (error) {
            logger.error('登入回調錯誤:', error);
            await authService.handleLogout(req.logout.bind(req));
            res.status(500).json({
                message: '登入過程發生錯誤',
                error: error.message
            });
        }
    }
);

/**
 * @api {get} /auth/logout 登出
 * @apiName Logout
 * @apiGroup Auth
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

/**
 * @api {get} /auth/protected 受保護的路由
 * @apiName ProtectedRoute
 * @apiGroup Auth
 * @apiSuccess {String} message 訪問成功
 */
router.get('/protected', 
    async (req, res) => {
        try {
            const result = await authService.verifyProtectedAccess(req.user);
            res.json(result);
        } catch (error) {
            res.status(401).json({
                message: '訪問驗證失敗',
                error: error.message
            });
        }
    }
);

module.exports = router; 