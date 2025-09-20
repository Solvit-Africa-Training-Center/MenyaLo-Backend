'use strict';

export async function up(queryInterface, Sequelize) {
  // 1️⃣ Enable pgvector extension (if needed, but for this example, you can skip it if not required)
  await queryInterface.sequelize.query(
    'CREATE EXTENSION IF NOT EXISTS vector;'
  );

  // 2️⃣ Create query_history table
  await queryInterface.createTable('query_history', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    query_text: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    execution_time: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    executed_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('NOW()'),
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true, 
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: 'success',
      allowNull: false,
    },
    embedding: {
      type: 'vector(768)', // Assuming you want to store vector embeddings, change if needed
      allowNull: true, 
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
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('query_history');

  await queryInterface.sequelize.query(
    'DROP EXTENSION IF EXISTS vector;'
  );
}
