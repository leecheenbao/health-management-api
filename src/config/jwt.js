// 引入 jwt 套件
const jwt = require('jsonwebtoken');

// 設定 JWT 密鑰
const secretKey = process.env.JWT_SECRET;

// 生成 JWT token
const sign = (payload) => {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

module.exports = {
    sign
};
