'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('addresses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        defaultValue:'Rwanda',
        allowNull:false
      },
      province: {
        type: Sequelize.STRING,
        allowNull:false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull:false,
      },
      district: {
        type: Sequelize.STRING,
        allowNull:false,
      },
      sector: {
        type: Sequelize.STRING,
        allowNull:false,
      },
      street: {
        type: Sequelize.STRING,
        allowNull:true,
      },
      latitude: {
        type: Sequelize.FLOAT,
        allowNull:true,
      },
      longitude: {
        type: Sequelize.FLOAT,
        allowNull:true,
      },
      profileId: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('addresses');
  }
};