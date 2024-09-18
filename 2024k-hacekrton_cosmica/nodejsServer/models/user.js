const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pw: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    userName: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    userType: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    rate: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    times: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    phoneNum: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    car: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    verify: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    veriftFilePath: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
