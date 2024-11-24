const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin, checkProfileCompleted } = require('../middlewares/authMiddleware');
const { validate, sanitizeData } = require('../middlewares/validator');
const { asyncHandler } = require('../middlewares/error');
const logger = require('../utils/logger');
const userService = require('../services/userService');
const pagination = require('../middlewares/pagination');


/**
 * @api {put} /api/user 01.填寫個人資料
 * @apiName UpdateUser
 * @apiGroup 02.用戶模組
 * @apiParam {String} name 姓名
 * @apiParam {String} hospital 院所
 * @apiParam {String} doctor_name 醟師姓名
 * @apiParam {String} phone 手機號碼
 * @apiSuccess {Object} user 用戶資料
 */
router.put('/',
    authenticateToken,
    sanitizeData,
    validate,
    asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const data = req.body;
        logger.info('data', data);
        const user = await userService.updateUser(userId, data);
        res.json(user);
    })
);

/**
 * @api {post} /api/user/quit 02.退出計劃
 * @apiName QuitPlan
 * @apiGroup 02.用戶模組
 * @apiSuccess {String} message 退出計劃成功
 */
router.post('/quit',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const result = await userService.quitPlan(userId);
        res.json(result);
    })
);


/**
 * @api {get} /api/user/login-records 03.獲取登入紀錄
 * @apiName GetLoginRecords
 * @apiGroup 02.用戶模組
 * @apiSuccess {Array} records 登入記錄列表
 */
router.get('/login-records',
    authenticateToken,                   
    isAdmin,                             
    sanitizeData,                        
    validate,                           
    pagination(),
    asyncHandler(async (req, res) => {
        const { page, limit } = req.pagination;
        const userId = req.user.id;
        
        const loginHistory = await userService.getLoginHistory(userId, {
            page,
            limit
        });
        
        res.paginate(
            loginHistory.records,
            loginHistory.total
        );
    })
);

module.exports = router; 