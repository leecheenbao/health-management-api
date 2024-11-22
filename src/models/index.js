'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/database.js')[env];
const db = {};

// 創建 Sequelize 實例
const sequelize = new Sequelize(
    config.database, 
    config.username, 
    config.password, 
    config
);

// 自動載入所有 model 文件
fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && 
               (file !== basename) && 
               (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(
            sequelize, 
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

// 設置模型關聯
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db; 