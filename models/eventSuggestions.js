module.exports = function(sequelize, DataTypes) {
    var eventSuggestions = sequelize.define("eventSuggestions", {
        category: DataTypes.STRING,
        eventName: DataTypes.STRING,
        status: DataTypes.STRING,
        startTime: DataTypes.DATE,
        endTime: DataTypes.DATE,
        price: DataTypes.INTEGER,
        location: DataTypes.STRING,
        date: DataTypes.DATE,
        upVote: DataTypes.INTEGER,
        downVote: DataTypes.INTEGER
    });

    eventSuggestions.associate = function(models) {
        eventSuggestions.belongsTo(models.event, {
            foreignKey: {
                allowNull: false
            }
        });
    };
    return eventSuggestions;
};