const jwt = require('jsonwebtoken');

const authMiddleware = {
  // 驗證 JWT Token
  verifyToken: (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: '未提供 Token'
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: '無效的 Token'
      });
    }
  },

  // 檢查是否已登入
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({
      success: false,
      message: '請先登入'
    });
  },

  // 檢查用戶角色
  checkRole: (roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: '未授權訪問'
        });
      }

      if (roles.includes(req.user.role)) {
        next();
      } else {
        res.status(403).json({
          success: false,
          message: '無權限執行此操作'
        });
      }
    };
  }
};

module.exports = authMiddleware; 