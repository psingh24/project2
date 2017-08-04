
// User Model
// ===============

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING(15)
    },
    email: {
      type: DataTypes.STRING(100)
    },
     password: {
      type: DataTypes.STRING(60)
    }
  });
  return User;
};