// NOTE any changes to this model should be reflected in ../../../web/src/types/

import { DataTypes, Model, Sequelize } from 'sequelize'

class FormType extends Model {}

const initFormType = (sequelize: Sequelize) => {
  FormType.init(
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
      modelName: 'FormType',
    }
  )

  return FormType
}

export default initFormType
