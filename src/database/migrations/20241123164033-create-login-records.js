'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('login_records', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        comment: '主鍵ID'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: '用戶ID'
      },
      login_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        comment: '登入時間'
      },
      ip_address: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'IP地址'
      },
      user_agent: {
        type: Sequelize.TEXT,
        comment: '用戶瀏覽器資訊'
      },
      device_info: {
        type: Sequelize.JSON,
        comment: '設備資訊（瀏覽器、作業系統等）'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        comment: '創建時間'
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        comment: '更新時間'
      }
    });

    // 添加索引
    await queryInterface.addIndex('login_records', ['user_id']);
    await queryInterface.addIndex('login_records', ['login_at']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('login_records');
  }
};
