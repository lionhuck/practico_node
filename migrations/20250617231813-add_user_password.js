'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Usuarios', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Usuarios', 'password');
  }
};
