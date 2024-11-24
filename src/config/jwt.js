const jwt = require('jsonwebtoken');
const UAParser = require('ua-parser-js');

// 從環境變數獲取配置
const config = {
    secretKey: process.env.JWT_SECRET,
    accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || '1h',
    refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d',
    issuer: process.env.JWT_ISSUER || 'health-management-api',
    audience: process.env.JWT_AUDIENCE || 'health-management-client'
};

class JwtService {
    static parseUserAgent(userAgent) {
        const parser = new UAParser(userAgent);
        return parser.getResult();
    }
    // 生成訪問令牌
    static generateAccessToken(payload) {
        return jwt.sign(payload, config.secretKey, {
            expiresIn: config.accessTokenExpiry,
            issuer: config.issuer,
            audience: config.audience
        });
    }

    // 生成刷新令牌
    static generateRefreshToken(userId) {
        return jwt.sign({ userId }, config.secretKey, {
            expiresIn: config.refreshTokenExpiry,
            issuer: config.issuer,
            audience: config.audience
        });
    }

    // 驗證令牌
    static verifyToken(token) {
        try {
            return jwt.verify(token, config.secretKey, {
                issuer: config.issuer,
                audience: config.audience
            });
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('令牌已過期');
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new Error('無效的令牌');
            }
            throw error;
        }
    }

    // 解碼令牌（不驗證）
    static decodeToken(token) {
        return jwt.decode(token);
    }

    // 生成完整的認證令牌對
    static generateTokenPair(user) {
        const tokenPayload = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        return {
            accessToken: this.generateAccessToken(tokenPayload),
            refreshToken: this.generateRefreshToken(user.id),
            expiresIn: config.accessTokenExpiry
        };
    }

    // 從請求頭中提取令牌
    static extractTokenFromHeader(req) {
        const authHeader = req.headers.authorization;
        if (!authHeader) return null;
        
        const [bearer, token] = authHeader.split(' ');
        if (bearer !== 'Bearer' || !token) return null;
        
        return token;
    }
}

module.exports = JwtService;
