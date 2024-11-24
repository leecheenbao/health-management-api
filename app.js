require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorMiddleware = require('./src/middlewares/error');
const session = require('express-session');
const passport = require('./src/config/passport');
const rateLimit = require('express-rate-limit');
const { notFound, errorHandler } = require('./src/middlewares/error');
const { rateLimit: rateLimitConfig } = require('./src/middlewares/validator');
const morgan = require('morgan');
const logger = require('./src/utils/logger');
const ApiError = require('./src/utils/ApiError');
const { testConnection } = require('./src/config/database');
const BASE_URL = process.env.BASE_URL;

const authRoutes = require('./src/routes/01_authRoutes');
// const userRoutes = require('./src/routes/02_userRoutes');
const healthRoutes = require('./src/routes/03_healthRoutes');
// const verificationRoutes = require('./src/routes/04_verificationRoutes');


const app = express();
logger.info('--------------------------------');
logger.info(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
logger.info(`BASE_URL: ${BASE_URL}`);

// 數據庫連接測試
testConnection();

// 中間件
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session 配置
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24小時
    }
  })
);

// 初始化 Passport
app.use(passport.initialize());
app.use(passport.session());

// 應用速率限制
app.use(rateLimit(rateLimitConfig));

// 使用 morgan 進行 HTTP 請求日誌記錄
// app.use(morgan('combined', { stream: logger.stream }));


// 路由
app.use(`${BASE_URL}/health`, healthRoutes);

// 認證路由
app.use('/auth', authRoutes);

// 404 處理
app.use(notFound);

// 錯誤處理中間件
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      type: err.type
    });
  }
  
  logger.error(logger.formatError(err));
  
  res.status(500).json({
    success: false,
    message: '服務器內部錯誤'
  });
});

logger.info(`PORT: ${process.env.PORT}`);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info('--------------------------------');
});

module.exports = app;