import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'
import initFormModel from './formModel'
import initTemplateModel from './templateModel'

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
const TemplateModel = initTemplateModel(sequelize)

// The following DO have dependencies from the preceding.
const FormModel = initFormModel(sequelize)

FormModel.belongsTo(TemplateModel, {
  foreignKey: 'templateId',
  as: 'template',
})

TemplateModel.hasMany(FormModel, {
  foreignKey: 'templateId',
  as: 'forms',
})

export {
  sequelize,
  FormModel,
  TemplateModel,
  Sequelize
}
