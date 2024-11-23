const express = require('express');
const router = express.Router();
const multer = require('multer');
const { asyncHandler } = require('../middlewares');
const { verifyToken } = require('../middlewares/authMiddleware');
const verificationService = require('../services/verificationService');

// 設置 multer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

/**
 * @api {post} /verification/upload 上傳藥盒照片
 */
router.post('/upload', [
    verifyToken,
    upload.single('image'),
    asyncHandler(async (req, res) => {
        const batch = await verificationService.uploadMedicationImage(
            req.file,
            req.user.id
        );
        res.json({
            message: '藥盒照片上傳成功',
            data: batch
        });
    })
]);

/**
 * @api {post} /verification/batch-numbers 批量添加藥品批號
 */
router.post('/batch-numbers', [
    verifyToken,
    asyncHandler(async (req, res) => {
        const batches = await verificationService.addBatchNumbers(
            req.body.batchNumbers,
            req.user.id
        );
        res.json({
            message: '藥品批號添加成功',
            data: batches
        });
    })
]);

/**
 * @api {post} /verification/verify/:batchNumber 驗證藥品批號
 */
router.post('/verify/:batchNumber', [
    verifyToken,
    asyncHandler(async (req, res) => {
        const batch = await verificationService.verifyBatchNumber(
            req.params.batchNumber,
            req.user.id
        );
        res.json({
            message: '藥品批號驗證成功',
            data: batch
        });
    })
]);

/**
 * @api {get} /verification/status 獲取驗證狀態
 */
router.get('/status', [
    verifyToken,
    asyncHandler(async (req, res) => {
        const status = await verificationService.getVerificationStatus(
            req.user.id
        );
        res.json(status);
    })
]);

module.exports = router; 