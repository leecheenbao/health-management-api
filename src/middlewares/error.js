const errorMiddleware = {
  // 404 錯誤處理
  notFound: (req, res, next) => {
    const error = new Error(`找不到 - ${req.originalUrl}`);
    res.status(404);
    next(error);
  },

  // 全局錯誤處理
  errorHandler: (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // 開發環境顯示完整錯誤堆疊
    const errorDetails = process.env.NODE_ENV === 'development' 
      ? err.stack 
      : {};

    res.status(statusCode).json({
      success: false,
      message: err.message,
      stack: errorDetails,
      timestamp: new Date().toISOString()
    });

    // 記錄錯誤
    console.error(`[Error] ${err.message}`);
    console.error(err.stack);
  },

  // 異步錯誤處理包裝器
  asyncHandler: (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
};

module.exports = errorMiddleware; 