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
      analysisFolderNameS3: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      exportFolderNameS3: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fileNameS3: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      formData: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      formTypeId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: sequelize.models.FormType.tableName,
          key: 'id',
        },
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      pages: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM,
        values: [
          'analyzing',
          'error',
          'initialized',
          'ready',
          'uploading',
        ],
        allowNull: false,
      },
      textractJobId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      textractKeyValues: {
        type: DataTypes.JSONB,
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
