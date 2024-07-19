import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'
import initForm from './form'
import initFormType from './formType'

dotenv.config()

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
  }
)

// The following DO NOT have any dependencies.
const FormType = initFormType(sequelize)

// The following DO have dependencies from the preceding.
const Form = initForm(sequelize)

Form.belongsTo(FormType, {
  foreignKey: 'formTypeId',
  as: 'formType',
})

FormType.hasMany(Form, {
  foreignKey: 'formTypeId',
  as: 'forms',
})

export {
  sequelize,
  Form,
  FormType,
  Sequelize
}
