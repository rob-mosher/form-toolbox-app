// NOTE any changes to this model should be reflected in ../../../web/src/types/

/* eslint-disable lines-between-class-members */

import {
  CreationOptional, DataTypes, Model, Sequelize,
} from 'sequelize'
import { FormType, FormCreationAttributes } from '../types'

class FormModel extends Model<FormType, FormCreationAttributes> implements FormType {
  public id!: CreationOptional<FormType['id']>
  public analysisFolderNameS3?: FormType['analysisFolderNameS3']
  public exportFolderNameS3?: FormType['exportFolderNameS3']
  public fileName?: FormType['fileName']
  public fileNameS3?: FormType['fileNameS3']
  public formDeclared?: FormType['formDeclared']
  public formDetected?: FormType['formDetected']
  public isDeleted!: FormType['isDeleted']
  public pageCount?: FormType['pageCount']
  public status!: FormType['status']
  public templateId?: FormType['templateId']
  public textractJobId?: FormType['textractJobId']
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
    },
    {
      sequelize,
      modelName: 'Forms',
    },
  )

  return FormModel
}

export default initFormModel
