module.exports = {
  HOST: "localhost",
  USER: "YOUR_DATABASE_USERNAME",
  PASSWORD: "YOUR_DATABASE_PASSWORD",
  DB: "YOUR_DATABASE_NAME",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};