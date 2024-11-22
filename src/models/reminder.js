'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reminder extends Model {
    static associate(models) {
      // 定義關聯
      Reminder.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }
  Reminder.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: '用戶ID'
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '提醒類型'
    },
    reminder_date: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: '提醒時間'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: '是否啟用'
    }
  }, {
    sequelize,
    modelName: 'Reminder',
    tableName: 'reminders',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Reminder;
};