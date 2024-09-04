const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userappointment', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'appointment',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'userappointment',
    timestamps: false,
    indexes: [
      {
        name: "userId",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
      {
        name: "appointmentId",
        using: "BTREE",
        fields: [
          { name: "appointmentId" },
        ]
      },
    ]
  });
};
