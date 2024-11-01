// NOTE any changes to this model should be reflected in ../../../web/src/types/

/* eslint-disable lines-between-class-members */

import {
  CreationOptional, DataTypes, Model, Sequelize,
} from 'sequelize'
import type { TForm, TFormCreationAttributes } from '../types'

class FormModel extends Model<TForm, TFormCreationAttributes> implements TForm {
  public id!: CreationOptional<TForm['id']>
  public analysisFolderNameS3?: TForm['analysisFolderNameS3']
  public fileName?: TForm['fileName']
  public fileNameS3?: TForm['fileNameS3']
  public formDeclared?: TForm['formDeclared']
  public formDetected?: TForm['formDetected']
  public isDeleted!: TForm['isDeleted']
  public pageCount?: TForm['pageCount']
  public previewFolderNameS3?: TForm['previewFolderNameS3']
  public status!: TForm['status']
  public templateId?: TForm['templateId']
  public textractJobId?: TForm['textractJobId']

  // `readonly` from the perspective of the application layer. These fields are automatically
  // managed by Sequelize during related transactions and should not be manually modified in the
  // code.
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

const initFormModel = (sequelize: Sequelize) => {
  FormModel.init(
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
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fileNameS3: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      formDeclared: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      formDetected: {
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
      previewFolderNameS3: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM,
        values: [
          'analyzing',
          'error',
          'initializing',
          'ready',
          'uploading',
        ],
        allowNull: false,
      },
      templateId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: sequelize.models.Templates.tableName,
          key: 'id',
        },
      },
      textractJobId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Forms',
      // 'timestamps' ensures Sequelize handles `createdAt` and `updatedAt`
      timestamps: true,
    },
  )

  return FormModel
}

export default initFormModel
