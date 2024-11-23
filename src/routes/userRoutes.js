/**
 * @api {get} /api/user/login-history 獲取登入歷史
 * @apiName GetLoginHistory
 * @apiGroup User
 * @apiSuccess {Array} records 登入記錄列表
 */
router.get('/login-history', isAuthenticated, async (req, res) => {
    try {
        const records = await req.user.getRecentLogins(10);
        res.json({
            message: '獲取成功',
            records: records.map(record => ({
                login_at: record.login_at,
                ip_address: record.ip_address,
                device_info: record.device_info
            }))
        });
    } catch (error) {
        res.status(500).json({
            message: '獲取登入歷史失敗',
            error: error.message
        });
    }
}); 