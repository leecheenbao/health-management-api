const { validationResult } = require('express-validator');

const validatorMiddleware = {
  // 驗證結果處理
  validate: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '輸入數據驗證失敗',
        errors: errors.array()
      });
    }
    next();
  },

  // 常用驗證規則
  sanitizeData: (req, res, next) => {
    // 移除敏感字段
    if (req.body.password) {
      delete req.body.password;
    }
    
    // 清理 XSS
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
    
    next();
  },

  // 請求速率限制
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15分鐘
    max: 100 // 限制每個IP在windowMs內最多100個請求
  }
};

module.exports = validatorMiddleware; 