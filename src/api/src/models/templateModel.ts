// NOTE any changes to this model should be reflected in ../../../web/src/types/

/* eslint-disable lines-between-class-members */

import {
  CreationOptional, DataTypes, Model, Sequelize,
} from 'sequelize'
import type { TTemplate, TTemplateCreationAttributes } from '../types'

// eslint-disable-next-line max-len
class TemplateModel extends Model<TTemplate, TTemplateCreationAttributes> implements TTemplate {
  public id!: CreationOptional<TTemplate['id']>
  public isDeleted!: TTemplate['isDeleted']
  public name!: TTemplate['name']
  public schemaJSON!: TTemplate['schemaJSON']
}

const initTemplateModel = (sequelize: Sequelize) => {
  TemplateModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      schemaJSON: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Templates',
    },
  )

  return TemplateModel
}

export default initTemplateModel
