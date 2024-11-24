async function checkLoginStatus() {
    try {
        const response = await axios.get('/auth/session');
        
        if (response.data.success) {
            // 解密數據（需要在前端實現相同的解密邏輯）
            const decryptedData = await decryptData(response.data.data);
            const sessionData = JSON.parse(decryptedData);
            
            if (sessionData.isAuthenticated) {
                const { user, token } = sessionData;
                
                // 存儲必要信息
                localStorage.setItem('token', token);
                
                // 檢查用戶狀態並重定向
                if (!user.profile_completed) {
                    window.location.href = '/complete-profile';
                } else {
                    window.location.href = '/dashboard';
                }
            }
        }
    } catch (error) {
        console.error('檢查登入狀態失敗:', error);
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