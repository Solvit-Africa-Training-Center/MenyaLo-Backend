'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('references', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      lawId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'laws',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      articleId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'articles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      parentReferenceId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'references',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      type: {
        type: Sequelize.ENUM('Law', 'Article', 'Commentary'),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      citation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('references', ['lawId'], {
      name: 'references_law_id_index',
    });

    await queryInterface.addIndex('references', ['articleId'], {
      name: 'references_article_id_index',
    });

    await queryInterface.addIndex('references', ['parentReferenceId'], {
      name: 'references_parent_reference_id_index',
    });

    await queryInterface.addIndex('references', ['userId'], {
      name: 'references_user_id_index',
    });

    await queryInterface.addIndex('references', ['type'], {
      name: 'references_type_index',
    });

    await queryInterface.addIndex('references', ['createdAt'], {
      name: 'references_created_at_index',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('references');
  },
};