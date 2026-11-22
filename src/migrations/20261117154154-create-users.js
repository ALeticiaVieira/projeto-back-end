'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      firstname: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      
      surname: {
        type: Sequelize.STRING(100),
        allowNull: false
      },

      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },

      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('users');
  }
};
