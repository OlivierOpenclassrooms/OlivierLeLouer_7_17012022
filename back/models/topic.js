module.exports = (sequelize, Sequelize) => {
    const Topic = sequelize.define("topic", {
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
    });
  
    return Topic;
  };