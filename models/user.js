module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define("user", {
        userName: {
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
    });

    user.associate = function(models) {
        user.hasMany(
            models.relationships, { 
                forgeignKey: "userID",
                onDelete: "cascade"
            })
        user.hasMany(
            models.preferences, { 
                forgeignKey: "userID", 
                onDelete: "cascade"
            })
        user.belongsToMany(models.event, {through: 'eventMembers'})

    };
    return user;
};
