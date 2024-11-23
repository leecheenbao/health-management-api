'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class LoginRecord extends Model {
        static associate(models) {
            // 定義與 User 的關聯
            LoginRecord.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });
        }
    }

    LoginRecord.init({
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            comment: '用戶ID'
        },
        login_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: '登入時間'
        },
        ip_address: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'IP地址'
        },
        user_agent: {
            type: DataTypes.TEXT,
            comment: '用戶瀏覽器資訊'
        },
        device_info: {
            type: DataTypes.JSON,
            comment: '設備資訊（瀏覽器、作業系統等）'
        }
    }, {
        sequelize,
        modelName: 'LoginRecord',
        tableName: 'login_records',
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return LoginRecord;
}; 