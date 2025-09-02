'use strict';

export async function up(queryInterface, Sequelize) {
  // Create history table with the correct columns
  await queryInterface.createTable('history', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    question: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    answer: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    source: {
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['database', 'web']],
      },
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
  });

  // Create index for better performance
  await queryInterface.addIndex('history', ['created_at'], {
    name: 'idx_history_created_at',
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('history');
}
