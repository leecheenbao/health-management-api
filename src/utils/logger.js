const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// 定義日誌級別
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// 根據環境選擇日誌級別
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'warn';
};

// 定義日誌顏色
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue'
};

winston.addColors(colors);

// 定義日誌格式
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// 定義日誌傳輸目標
const transports = [
  // 控制台輸出
  new winston.transports.Console(),
  
  // 錯誤日誌文件
  new DailyRotateFile({
    filename: path.join('logs', 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '20m',
    maxFiles: '14d'
  }),
  
  // 所有日誌文件
  new DailyRotateFile({
    filename: path.join('logs', 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d'
  })
];

// 創建 logger 實例
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports
});

// 添加輔助方法
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

// 請求日誌格式化
logger.formatRequestLog = (req, res, responseTime) => {
  return `${req.method} ${req.url} ${res.statusCode} ${responseTime}ms`;
};

// 錯誤日誌格式化
logger.formatError = (err) => {
  return {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
    ...err
  };
};

module.exports = logger; 