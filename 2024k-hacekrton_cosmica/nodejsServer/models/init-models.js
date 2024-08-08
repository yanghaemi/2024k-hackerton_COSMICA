var DataTypes = require("sequelize").DataTypes;
var _report = require("./report");

function initModels(sequelize) {
  var report = _report(sequelize, DataTypes);


  return {
    report,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
