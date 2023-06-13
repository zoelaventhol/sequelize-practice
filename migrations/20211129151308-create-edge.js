"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Edges", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      Node1Id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Nodes",
          key: "id",
        },
        allowNull: false,
      },
      Node2Id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Nodes",
          key: "id",
        },
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Edges");
  },
};
