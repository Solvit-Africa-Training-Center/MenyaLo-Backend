'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('post_hashtags', {
      postId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'posts',
          key: 'id',
        },
      },
      hashtagId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'hashtags',
          key: 'id',
        },
      },
    });

    await queryInterface.addConstraint('post_hashtags', {
      fields: ['postId', 'hashtagId'],
      type: 'unique',
      name: 'post_hashtags_unique',
    });
    
    await queryInterface.addIndex('post_hashtags', {
      fields: ['hashtagId'],
      name: 'post_hashtags_hashtag_id_index',
    });
    
    await queryInterface.addIndex('post_hashtags', {
      fields: ['postId'],
      name: 'post_hashtags_post_id_index',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('post_hashtags');
  }
};