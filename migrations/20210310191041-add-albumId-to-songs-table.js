"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      "Songs", // name of Source model
      "AlbumId", // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: "Albums", // name of Target model
          key: "id", // key in Target model that we're referencing
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      "Songs", // name of Source model
      "AlbumId" // key we want to remove
    );
  },
};
