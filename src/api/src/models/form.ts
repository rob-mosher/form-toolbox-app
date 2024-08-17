// NOTE any changes to this model should be reflected in ../../../web/src/types/

import { DataTypes, Model, Sequelize } from 'sequelize'

class Form extends Model {}

const initForm = (sequelize: Sequelize) => {
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
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      pageCount: {
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
      templateId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: sequelize.models.Template.tableName,
          key: 'id',
        },
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
  )

  return Form
}

export default initForm
