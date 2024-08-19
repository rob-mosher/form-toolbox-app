// NOTE any changes to this model should be reflected in ../../../web/src/types/

import { DataTypes, Model, Sequelize } from 'sequelize'

class TemplateModel extends Model {}

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
      modelName: 'Template',
    }
  )

  return TemplateModel
}

export default initTemplateModel
