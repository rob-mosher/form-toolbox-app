// NOTE any changes to this model should be reflected in ../../../web/src/types/

import { DataTypes, Model, Sequelize } from 'sequelize'

class Template extends Model {}

const initTemplate = (sequelize: Sequelize) => {
  Template.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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

  return Template
}

export default initTemplate
