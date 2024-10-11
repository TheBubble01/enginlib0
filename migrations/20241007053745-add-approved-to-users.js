'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'approved', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false // Default value for existing admins
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'approved');
  }
};

