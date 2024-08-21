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

// Use singular 'template' for belongsTo association as each Form belongs to one Template
FormModel.belongsTo(TemplateModel, {
  foreignKey: 'templateId',
  as: 'template',
})

// Use plural 'forms' for hasMany association as each Template has many Forms
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
