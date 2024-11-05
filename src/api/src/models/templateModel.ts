// NOTE any changes to this model should be reflected in ../../../web/src/types/

/* eslint-disable lines-between-class-members */

import {
  CreationOptional, DataTypes, Model, Sequelize,
} from 'sequelize'
import type { TTemplate, TTemplateCreationAttributes } from '../types'

class TemplateModel extends Model<TTemplate, TTemplateCreationAttributes> implements TTemplate {
  public id!: CreationOptional<TTemplate['id']>
  public isDeleted!: TTemplate['isDeleted']
  public formSchema!: TTemplate['formSchema']
  public formSchemaCount!: number
  public name!: TTemplate['name']
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
      formSchema: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      formSchemaCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
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
