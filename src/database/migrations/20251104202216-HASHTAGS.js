'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hashtags', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: 'Hashtag name cannot be empty',
          },
          len: {
            args: [1, 100],
            msg: 'Hashtag name must be between 1 and 100 characters',
          },
        },
      },
      postCount: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: 'Post count cannot be negative',
          },
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
        deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addConstraint('hashtags', {
      fields: ['name'],
      type: 'unique',
      name: 'hashtags_name_unique',
    });
    
    await queryInterface.addIndex('hashtags', {
      fields: ['postCount'],
      name: 'hashtags_post_count_index',
    });
    
    await queryInterface.addIndex('hashtags', {
      fields: ['createdAt'],
      name: 'hashtags_created_at_index',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('hashtags');
  }
};