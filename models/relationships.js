module.exports = function(sequelize, DataTypes) {
    var relationships = sequelize.define("relationships", {
        friendID: DataTypes.INTEGER,
        status: DataTypes.STRING,
    });

    relationships.associate = function(models) {
        relationships.belongsTo(models.user, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return relationships;
};
