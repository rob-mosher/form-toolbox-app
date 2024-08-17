import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'
import initForm from './form'
import initTemplate from './template'

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
const Template = initTemplate(sequelize)

// The following DO have dependencies from the preceding.
const Form = initForm(sequelize)

Form.belongsTo(Template, {
  foreignKey: 'templateId',
  as: 'template',
})

Template.hasMany(Form, {
  foreignKey: 'templateId',
  as: 'forms',
})

export {
  sequelize,
  Form,
  Template,
  Sequelize
}
