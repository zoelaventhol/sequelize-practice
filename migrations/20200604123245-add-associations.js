"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      "Albums", // name of Source model
      "ArtistId", // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: "Artists", // name of Target model
          key: "id", // key in Target model that we're referencing
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      "Albums", // name of Source model
      "ArtistId" // key we want to remove
    );
  },
};
