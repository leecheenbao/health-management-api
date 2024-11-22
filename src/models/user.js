'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // 定義關聯
            User.hasMany(models.Reminder, {
                foreignKey: 'user_id',
                as: 'reminders'
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