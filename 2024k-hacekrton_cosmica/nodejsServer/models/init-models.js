var DataTypes = require("sequelize").DataTypes;
var _appointment = require("./appointment");
var _report = require("./report");
var _user = require("./user");
var _userappointment = require("./userappointment");

function initModels(sequelize) {
  var appointment = _appointment(sequelize, DataTypes);
  var report = _report(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var userappointment = _userappointment(sequelize, DataTypes);

  userappointment.belongsTo(appointment, { as: "appointment", foreignKey: "appointmentId"});
  appointment.hasMany(userappointment, { as: "userappointments", foreignKey: "appointmentId"});
  appointment.belongsTo(user, { as: "wheelchair", foreignKey: "wheelchairId"});
  user.hasMany(appointment, { as: "appointments", foreignKey: "wheelchairId"});
  appointment.belongsTo(user, { as: "companion", foreignKey: "companionId"});
  user.hasMany(appointment, { as: "companion_appointments", foreignKey: "companionId"});
  userappointment.belongsTo(user, { as: "user", foreignKey: "userId"});
  user.hasMany(userappointment, { as: "userappointments", foreignKey: "userId"});

  return {
    appointment,
    report,
    user,
    userappointment,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
