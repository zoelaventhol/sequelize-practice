"use strict";
module.exports = (sequelize, DataTypes) => {
  const Node = sequelize.define(
    "Node",
    {
      name: DataTypes.STRING,
    },
    {}
  );
  Node.associate = function (models) {
    Node.belongsToMany(models.Node, {
      // important to use the model object here instead of the string if we want to insert data in the junction table
      through: models.Edge,
      foreignKey: "Node2Id",
      as: "Start",
    });
    Node.belongsToMany(models.Node, {
      through: models.Edge,
      foreignKey: "Node1Id",
      as: "Connection", // alias
    });
  };
  return Node;
};
