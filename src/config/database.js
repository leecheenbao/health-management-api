const { Sequelize } = require('sequelize');
require('dotenv').config();
const logger = require('../utils/logger');

// Sequelize 實例配置
const sequelizeConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    timezone: '+08:00',
    dialectOptions: {
        dateStrings: true,
        typeCast: true
    }
};

// 創建 Sequelize 實例
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    sequelizeConfig
);

// 測試數據庫連接
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        logger.info('數據庫連接成功。');
    } catch (error) {
        logger.error(`無法連接到數據庫: ${error}`);
        process.exit(1);
    }
};

// 同步數據庫模型
const syncDatabase = async (force = false) => {
    try {
        await sequelize.sync({ force });
        logger.info('數據庫同步成功');
    } catch (error) {
        logger.error(`數據庫同步錯誤: ${error}`);
        process.exit(1);
    }
};

// 為 sequelize-cli 導出配置
module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        timezone: '+08:00'
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_TEST,
        host: process.env.DB_HOST,
        dialect: 'mysql',
        timezone: '+08:00'
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'mysql',
        timezone: '+08:00'
    },
    sequelize,
    testConnection,
    syncDatabase
}; 