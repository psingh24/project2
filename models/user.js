
// User Model
// ===============

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: '',
      unique: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    password: {
      type: "BINARY(60)",
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'random.PNG'
    }
  }, {
    tableName: 'User'
  });
};
