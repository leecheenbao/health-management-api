const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

// 非同步錯誤處理包裝器
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 錯誤處理
const notFound = (req, res, next) => {
    next(ApiError.notFound('找不到請求的資源'));
};

// 統一錯誤處理
const errorHandler = (err, req, res, next) => {
    logger.error('Error:', err);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            type: err.type
        });
    }

    // 其他錯誤轉換為 ApiError
    const apiError = ApiError.internal(err.message || '服務器內部錯誤');
    
    res.status(apiError.statusCode).json({
        success: false,
        message: apiError.message,
        type: apiError.type
    });
};

module.exports = {
    asyncHandler,
    notFound,
    errorHandler
}; 