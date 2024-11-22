const express = require('express');
const passport = require('passport');
const router = express.Router();

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
    (req, res) => {
        res.redirect('/dashboard');
    }
);

/**
 * @api {get} /auth/logout 登出
 * @apiName Logout
 * @apiGroup 01.登入
 * @apiSuccess {String} message 登出成功
 */
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router; 