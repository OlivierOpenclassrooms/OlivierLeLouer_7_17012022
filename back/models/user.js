module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      biographie: {
        type: Sequelize.STRING,
        allowNull: true
      },
      nom: {
        type: Sequelize.STRING,
        allowNull: false
      },
      prénom: {
        type: Sequelize.STRING,
        allowNull: false
      },
      poste: {
        type: Sequelize.STRING,
        allowNull: true
      },
      photo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        default: false
      }
    });
  
    return User;
  };