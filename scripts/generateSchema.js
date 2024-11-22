const { sequelize } = require('../src/config/database');
const fs = require('fs');
const path = require('path');
const logger = require('../src/utils/logger');

async function generateSchema() {
    try {
        // 先執行遷移以確保表格存在
        await sequelize.sync();

        // 要導出的表名列表
        const tables = [
            'users',
            'medicine_verifications',
            'reminders',
            'educational_materials',
            'material_tags',
            'material_tag_relations',
            'login_records',
            'withdrawal_records'
        ];

        let schemaSQL = '-- 資料庫結構導出\n\n';

        // 獲取每個表的創建語句
        for (const table of tables) {
            logger.info(`正在處理表格: ${table}`);
            
            // 獲取表註釋
            const [tableInfo] = await sequelize.query(`SHOW TABLE STATUS WHERE Name = '${table}'`);
            const tableComment = tableInfo[0].Comment;
            
            schemaSQL += `-- ${table} 表結構 (${tableComment})\n`;
            
            // 獲取建表語句
            const [results] = await sequelize.query(`SHOW CREATE TABLE ${table}`);
            if (results && results[0]) {
                schemaSQL += results[0]['Create Table'] + ';\n\n';
            }
        }

        // 確保 sql 目錄存在
        const sqlDir = path.join(__dirname, '../sql');
        if (!fs.existsSync(sqlDir)) {
            fs.mkdirSync(sqlDir, { recursive: true });
        }

        // 檔名依據時間及流水號組合寫入文件
        const timestamp = new Date().toISOString().replace(/[-:T]/g, '').substring(0, 15);
        const filePath = path.join(__dirname, `../sql/schema_${timestamp}.sql`);
        fs.writeFileSync(filePath, schemaSQL, 'utf8');

        logger.info(`Schema 已成功導出到 ${filePath}`);
        
        // 關閉連接
        await sequelize.close();
        
    } catch (error) {
        logger.error(`生成 Schema 時發生錯誤: ${error}`);
        logger.error(error.stack);
        process.exit(1);
    }
}

// 執行函數
generateSchema().catch(console.error); 