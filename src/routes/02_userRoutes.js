const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middlewares/auth');
const { validate, sanitizeData } = require('../middlewares/validator');
const { asyncHandler } = require('../middlewares/error');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * @api {get} /api/user/login-history 獲取登入歷史
 * @apiName GetLoginHistory
 * @apiGroup User
 * @apiSuccess {Array} records 登入記錄列表
 */
router.get('/login-history',
    // verifyToken,                    // 驗證 Token
    // checkRole(['admin', 'doctor']), // 檢查角色
    sanitizeData,                   // 數據清理
    validate,                       // 驗證數據
    asyncHandler(async (req, res) => {

      console.log(req.pagination);
      const { page, limit, offset } = req.pagination;
      const loginRecords = await UserService.getLoginRecords(req.user.id, { page, limit, offset });
      res.paginate(
        loginRecords.rows, 
        loginRecords.count
      );
    })
  );





module.exports = router; 