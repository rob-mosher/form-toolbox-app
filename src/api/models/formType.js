// NOTE any changes to this model should be reflected in ../../web/src/types/

const { Model, DataTypes } = require('sequelize');

class FormType extends Model {}

module.exports = (sequelize) => {
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
  );

  return FormType;
};
