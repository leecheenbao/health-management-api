const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middlewares/auth');
const { validate, sanitizeData } = require('../middlewares/validator');
const { asyncHandler } = require('../middlewares/error');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

// 健康數據相關路由
router.post('/records',
  verifyToken,                    // 驗證 Token
  checkRole(['admin', 'doctor']), // 檢查角色
  sanitizeData,                   // 數據清理
  validate,                       // 驗證數據
  asyncHandler(async (req, res) => {
    // 處理請求
  })
);
// router.get('/records', healthController.getHealthRecords);
// router.get('/records/:id', healthController.getHealthRecordById);
// router.put('/records/:id', healthController.updateHealthRecord);
// router.delete('/records/:id', healthController.deleteHealthRecord);

module.exports = router; 