'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS vector;');

  await queryInterface.createTable('documents', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    filename: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    filepath: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    embedding: {
      type: 'vector(768)', // Sequelize doesn't have vector type, raw SQL type is fine
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('NOW()'),
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('NOW()'),
      allowNull: false,
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('documents');
  await queryInterface.sequelize.query('DROP EXTENSION IF EXISTS vector;');
}
