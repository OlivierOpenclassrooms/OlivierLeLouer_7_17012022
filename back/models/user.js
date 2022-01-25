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
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nom: {
        type: Sequelize.STRING,
        allowNull: true
      },
      prenom: {
        type: Sequelize.STRING,
        allowNull: true
      },
      poste: {
        type: Sequelize.STRING,
        allowNull: true
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
      }
    });
  
    return User;
  };