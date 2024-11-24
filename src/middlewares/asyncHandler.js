const ApiError = require('../utils/ApiError');

// 統一的響應格式
const successResponse = (data, message = "操作成功") => ({
    status: "success",
    message,
    data
});

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error('Error:', err);  // 添加錯誤日誌
    
    // 檢查是否為 ApiError 實例
    const error = err instanceof ApiError 
      ? err 
      : new ApiError(500, err.message || '系統錯誤');
    
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message
    });
  });
};

module.exports = asyncHandler; 