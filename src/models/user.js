'use strict';
const { Model } = require('sequelize');
const { Op } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // 定義關聯
            User.hasMany(models.Reminder, {
                foreignKey: 'user_id',
                as: 'reminders'
            });
            User.hasMany(models.LoginRecord, {
                foreignKey: 'user_id',
                as: 'loginRecords'
            });
        }

        // 實例方法應該定義在這裡
        async createLoginRecord(req) {
            const { LoginRecord } = require('../models');
            const UAParser = require('ua-parser-js');

            try {
                // 檢查 req 是否存在
                if (!req) {
                    // 創建基本的登入記錄
                    return await LoginRecord.create({
                        user_id: this.id,
                        login_at: new Date(),
                        ip_address: 'unknown',
                        user_agent: 'unknown',
                        device_info: {
                            browser: { name: 'unknown', version: 'unknown' },
                            os: { name: 'unknown', version: 'unknown' },
                            device: {}
                        }
                    });
                }

                // 安全地解析 User-Agent
                const userAgent = req.headers?.['user-agent'] || 'unknown';
                const parser = new UAParser(userAgent);
                const parsedUA = parser.getResult();

                // 安全地獲取 IP
                const ip = req.ip || 
                          req.headers?.['x-forwarded-for']?.split(',')[0] || 
                          req.connection?.remoteAddress ||
                          'unknown';

                // 創建設備信息對象
                const deviceInfo = {
                    browser: {
                        name: parsedUA.browser.name || 'unknown',
                        version: parsedUA.browser.version || 'unknown'
                    },
                    os: {
                        name: parsedUA.os.name || 'unknown',
                        version: parsedUA.os.version || 'unknown'
                    },
                    device: parsedUA.device || {}
                };

                // 創建登入記錄
                const loginRecord = await LoginRecord.create({
                    user_id: this.id,
                    login_at: new Date(),
                    ip_address: ip,
                    user_agent: userAgent,
                    device_info: deviceInfo
                });

                return loginRecord;
            } catch (error) {
                console.error('創建登入記錄失敗:', error);
                // 即使出錯也不影響登入流程
                return null;
            }
        }

        // 獲取最近登入記錄的方法
        async getRecentLogins(limit = 5) {
            const { LoginRecord } = require('../models');
            return await LoginRecord.findAll({
                where: { user_id: this.id },
                order: [['login_at', 'DESC']],
                limit
            });
        }
    }

    User.init({
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: '用戶名稱'
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: '用戶信箱'
        },
        hospital: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: '用戶醫院'
        },
        doctor_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: '用戶醫師名稱'
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
            comment: '用戶手機號碼'
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: '用戶是否啟用'
        },
        privacy_agreed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: '用戶是否同意隱私政策'
        },
        google_id: {
            type: DataTypes.STRING,
            unique: true,
            comment: 'Google ID'
        },
        avatar_url: {
            type: DataTypes.STRING,
            comment: '用戶頭像URL'
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return User;
};