const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('route', {
    routeId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    data: {
      type: DataTypes.STRING(10000),
      allowNull: false,
      defaultValue: ""
    },
    origin: {
      type: DataTypes.STRING(5000),
      allowNull: false,
      defaultValue: ""
    },
    destination: {
      type: DataTypes.STRING(5000),
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'route',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "routeId" },
        ]
      },
    ]
  });
};
