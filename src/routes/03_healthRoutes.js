const express = require('express');
const router = express.Router();
const { validate, sanitizeData } = require('../middlewares/validator');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');
const { asyncHandler } = require('../middlewares/error');
const logger = require('../utils/logger');

/**
 * @api {post} /api/v1/health/records 健康數據相關路由
 * @apiName HealthRecords
 * @apiGroup 03.健康數據
 * @apiParam {String} hospital 醫院名稱
 * @apiParam {String} doctor_name 醫師姓名
 * @apiParam {String} phone 手機號碼
 * @apiParam {String} email 電子郵件
 * @apiParam {Boolean} is_active 是否啟用
 * @apiParam {Boolean} privacy_agreed 是否同意隱私權政策
 * @apiSuccess {Object[]} healthRecords 健康數據列表
 */
router.get('/records',
  authenticateToken,
  // isAdmin,
  sanitizeData,                   // 數據清理
  validate,                       // 驗證數據
  asyncHandler(async (req, res) => {
    // 處理請求
    logger.info('健康數據相關路由');
    res.json({ message: '健康數據相關路由' });
  })
);
// router.get('/records', healthController.getHealthRecords);
// router.get('/records/:id', healthController.getHealthRecordById);
// router.put('/records/:id', healthController.updateHealthRecord);
// router.delete('/records/:id', healthController.deleteHealthRecord);

module.exports = router; 