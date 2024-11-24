const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwtUtil = require('../config/jwt.js');
const authService = require('../services/authService.js');
const logger = require('../utils/logger.js');
const asyncHandler = require("../middlewares/asyncHandler");
const successRedirectUrl = process.env.GOOGLE_SUCCESS_REDIRECT_URL;
const failureRedirectUrl = process.env.GOOGLE_FAILURE_REDIRECT_URL;

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
        successRedirect: successRedirectUrl,
        session: true 
    }),
    async (req, res) => {
        try {
            const result = await authService.handleGoogleLogin(req);
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

module.exports = router; 