module.exports = function(sequelize, DataTypes) {
    var preferences = sequelize.define("preferences", {
        category: DataTypes.STRING,
        preference: DataTypes.STRING,
    });

    preferences.associate = function(models) {
        preferences.belongsTo(models.user, {
            foreignKey: {
                allowNull: false
            }
        });
    };
    return preferences;
};