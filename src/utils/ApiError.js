class ApiError extends Error {
  constructor(statusCode, message, type = 'error') {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.name = 'ApiError';
    
    // 捕獲堆疊跟踪
    Error.captureStackTrace(this, this.constructor);
  }

  static error(message) {
    return new ApiError(200, message, 'error');
  }
}

module.exports = ApiError; 