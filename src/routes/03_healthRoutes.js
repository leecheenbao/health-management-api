const express = require('express');
const router = express.Router();
const { validate, sanitizeData } = require('../middlewares/validator');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');
const asyncHandler = require('../middlewares/asyncHandler');
const logger = require('../utils/logger');

// router.get('/records', healthController.getHealthRecords);
// router.get('/records/:id', healthController.getHealthRecordById);
// router.put('/records/:id', healthController.updateHealthRecord);
// router.delete('/records/:id', healthController.deleteHealthRecord);

module.exports = router; 