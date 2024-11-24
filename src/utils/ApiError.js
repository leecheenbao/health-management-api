class ApiError extends Error {
  constructor(statusCode = 500, message = '系統錯誤') {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    // 捕獲堆疊跟踪
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError; 