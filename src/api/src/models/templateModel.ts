// NOTE any changes to this model should be reflected in ../../../web/src/types/

/* eslint-disable lines-between-class-members */

import {
  CreationOptional, DataTypes, Model, Sequelize,
} from 'sequelize'
import { TemplateType, TemplateCreationAttributes } from '../types'

// eslint-disable-next-line max-len
class TemplateModel extends Model<TemplateType, TemplateCreationAttributes> implements TemplateType {
  public id!: CreationOptional<TemplateType['id']>
  public isDeleted!: TemplateType['isDeleted']
  public name!: TemplateType['name']
  public schema!: TemplateType['schema']
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
      schema: {
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
