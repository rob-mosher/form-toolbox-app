// NOTE any changes to this model should be reflected in ../../../web/src/types/

/* eslint-disable lines-between-class-members */

import { DataTypes, Model, Sequelize } from 'sequelize'

interface TemplateModelType {
  id: string;
  isDeleted: boolean;
  name: string;
  schema: string; // TODO might need to be more specific
}

class TemplateModel extends Model<TemplateModelType> implements TemplateModelType {
  public id!:TemplateModelType['id']
  public isDeleted!: TemplateModelType['isDeleted']
  public name!: TemplateModelType['name']
  public schema!: TemplateModelType['schema']
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
    }
  )

  return TemplateModel
}

export default initTemplateModel
