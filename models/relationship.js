/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('relationship', {
    user_one_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    user_two_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'Pending'
    },
    action_user_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    }
  }, {
    tableName: 'relationship'
  });
};
