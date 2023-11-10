const { Model, DataTypes } = require('sequelize');

class Form extends Model {}

module.exports = (sequelize) => {
  Form.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fileNameS3: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: [
          'analyzing',
          'deleted',
          'error',
          'ready',
          'uploading',
        ],
        allowNull: false,
      },
      textractJobId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Form',
    }
  );

  return Form;
};
