const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const { COMMON_RESPONSE_CODE, USER_STATUS, USER_ROLE } = require('../enum/commonEnum');

/**
 * JWT Token 驗證中間件
 */
const authenticateToken = async (req, res, next) => {
    try {
        // 獲取 Token
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            throw new ApiError(200, '缺少 Token');
        }

        // 驗證 Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await User.findByPk(userId);
        
        if (!user) {
            throw new ApiError(200, '用戶不存在');
        }

        console.log(user.is_active);
        // 檢查用戶狀態
        if (user.is_active === USER_STATUS.INACTIVE) {
            throw new ApiError(200, '用戶已退出計劃');
        }

        // 將用戶資訊添加到請求對象
        req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status,
            profile_completed: user.profile_completed
        };

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(200).json({
                success: false,
                code: COMMON_RESPONSE_CODE.TOKEN_INVALID,
                message: 'Token 無效'
            });
        }

        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                code: error.statusCode,
                message: error.message
            });
        }

        logger.error('Token 驗證錯誤:', error);
        return res.status(200).json({
            success: false,
            code: COMMON_RESPONSE_CODE.INTERNAL_SERVER_ERROR,
            message: '服務器內部錯誤'
        });
    }
};

/**
 * 檢查用戶是否已完成個人資料
 */
const checkProfileCompleted = (req, res, next) => {
    try {
        if (!req.user.profile_completed) {
            throw new ApiError(200, '請先完善個人資料');
        }
        next();
    } catch (error) {
        next(error);
    }
};

/**
 * 檢查用戶是否為管理員
 */
const isAdmin = (req, res, next) => {
    if (req.user.role !== USER_ROLE.ADMIN) {
        throw new ApiError(200, '無權限訪問');
    }
    next();
};


module.exports = {
    authenticateToken,
    isAdmin,
    checkProfileCompleted
};