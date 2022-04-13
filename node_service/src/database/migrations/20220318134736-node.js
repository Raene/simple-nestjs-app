'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('node_stats', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
        unique: true,
        type: Sequelize.INTEGER,
      },
      uptime: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      totalRam: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      totalDisk: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      allocDisk: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updatedAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('node_stats');
  },
};
