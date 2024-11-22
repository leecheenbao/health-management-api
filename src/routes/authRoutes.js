const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google登入路由
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// Google回調路由
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/dashboard',
  })
);

// 檢查登入狀態的中間件
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: '未授權訪問' });
};

// 登出路由
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// 獲取當前用戶信息
router.get('/user', isAuthenticated, (req, res) => {
  res.json(req.user);
});

module.exports = router; 