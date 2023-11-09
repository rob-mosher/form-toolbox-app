const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
  }
);

const Form = require('./form')(sequelize);

module.exports = {
  sequelize,
  // Sequelize,
  Form,
};
