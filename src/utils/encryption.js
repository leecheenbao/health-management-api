const crypto = require('crypto');
const logger = require('./logger');

// 從環境變量獲取密鑰
const ENCRYPTION_KEY = process.env.SESSION_SECRET || 'sdflkc93*&^%$#@!j';

// 使用 SHA-256 生成固定長度的密鑰
const KEY = crypto.createHash('sha256')
    .update(ENCRYPTION_KEY)
    .digest();  // 這會生成一個 32 字節的 Buffer

const IV_LENGTH = 16; // AES-256-CBC 需要 16 字節的 IV

/**
 * 加密數據
 * @param {string} text 要加密的文本
 * @returns {string} 加密後的文本
 */
function encrypt(text) {
    try {
        // 檢查輸入
        if (!text || typeof text !== 'string') {
            throw new Error('加密輸入必須是字符串');
        }

        // 生成隨機初始向量
        const iv = crypto.randomBytes(IV_LENGTH);
        
        // 創建加密器
        const cipher = crypto.createCipheriv(
            'aes-256-cbc', 
            KEY,  // 使用生成的 32 字節密鑰
            iv
        );
        
        // 加密數據
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        // 返回 IV + 加密數據的組合
        return `${iv.toString('hex')}:${encrypted}`;
    } catch (error) {
        logger.error('加密錯誤:', error);
        throw new Error('加密失敗: ' + error.message);
    }
}

/**
 * 解密數據
 * @param {string} text 要解密的文本
 * @returns {string} 解密後的文本
 */
function decrypt(text) {
    try {
        // 檢查輸入
        if (!text || typeof text !== 'string') {
            throw new Error('解密輸入必須是字符串');
        }

        // 分離 IV 和加密數據
        const [ivHex, encryptedText] = text.split(':');
        if (!ivHex || !encryptedText) {
            throw new Error('無效的加密格式');
        }

        const iv = Buffer.from(ivHex, 'hex');
        
        // 創建解密器
        const decipher = crypto.createDecipheriv(
            'aes-256-cbc', 
            KEY,  // 使用相同的 32 字節密鑰
            iv
        );
        
        // 解密數據
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (error) {
        logger.error('解密錯誤:', error);
        throw new Error('解密失敗: ' + error.message);
    }
}

/**
 * 測試加密功能
 */
function testEncryption() {
    try {
        const testData = JSON.stringify({
            test: 'Hello World',
            timestamp: new Date().toISOString()
        });
        
        const encrypted = encrypt(testData);
        const decrypted = decrypt(encrypted);
        logger.info('加密測試成功');
        return true;
    } catch (error) {
        logger.error('加密測試失敗:', error);
        return false;
    }
}

// 啟動時測試加密功能
testEncryption();

module.exports = {
    encrypt,
    decrypt,
    testEncryption
}; 