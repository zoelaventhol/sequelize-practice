"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      "Topics", // name of Source model
      "ParentId", // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: "Topics", // name of Target model
          key: "id", // key in Target model that we're referencing
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      "Topics", // name of Source model
      "ParentId" // key we want to remove
    );
  },
};
