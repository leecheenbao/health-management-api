'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'google_id', {
      type: Sequelize.STRING,
      unique: true,
      comment: 'Google ID'
    });

    await queryInterface.addColumn('users', 'avatar_url', {
      type: Sequelize.STRING,
      comment: '用戶頭像URL'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'google_id');
    await queryInterface.removeColumn('users', 'avatar_url');
  }
};
