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

// The following DO NOT have any dependencies.
const FormType = require('./formType')(sequelize);

// The following DO have dependencies from the preceding.
const Form = require('./form')(sequelize);

Form.belongsTo(FormType, {
  foreignKey: 'formTypeId',
  as: 'formType',
});

FormType.hasMany(Form, {
  foreignKey: 'formTypeId',
  as: 'forms',
});

module.exports = {
  sequelize,
  Form,
  FormType,
  Sequelize,
};
