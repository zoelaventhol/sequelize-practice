"use strict";
module.exports = (sequelize, DataTypes) => {
  const Edge = sequelize.define(
    "Edge",
    {
      name: DataTypes.STRING,
    },
    {}
  );
  Edge.associate = function (models) {
    // associations can be defined here
  };
  return Edge;
};
