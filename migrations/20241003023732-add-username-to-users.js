'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'username', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      defaultValue: Sequelize.literal("concat('user_', floor(random() * 10000)::text)") // Default unique value
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'username');
  }
};

