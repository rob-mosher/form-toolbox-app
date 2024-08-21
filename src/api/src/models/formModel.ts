// NOTE any changes to this model should be reflected in ../../../web/src/types/

/* eslint-disable lines-between-class-members */

import { DataTypes, Model, Sequelize } from 'sequelize'
import { FormItemType } from '../types'

interface FormModelType {
  id: string;
  analysisFolderNameS3?: string;
  exportFolderNameS3?: string;
  fileName?: string;
  fileNameS3?: string;
  formDeclared?: Record<string, FormItemType>;
  formDetected?: Record<string, FormItemType>;
  isDeleted: boolean;
  pageCount?: number;
  status: 'analyzing' | 'error' | 'initialized' | 'ready' | 'uploading';
  templateId?: string;
  textractJobId?: string;
}

class FormModel extends Model<FormModelType> implements FormModelType {
  public id!: FormModelType['id']
  public analysisFolderNameS3?: FormModelType['analysisFolderNameS3']
  public exportFolderNameS3?: FormModelType['exportFolderNameS3']
  public fileName?: FormModelType['fileName']
  public fileNameS3?: FormModelType['fileNameS3']
  public formDeclared?: FormModelType['formDeclared']
  public formDetected?: FormModelType['formDetected']
  public isDeleted!: FormModelType['isDeleted']
  public pageCount?: FormModelType['pageCount']
  public status!: FormModelType['status']
  public templateId?: FormModelType['templateId']
  public textractJobId?: FormModelType['textractJobId']
  form: FormItemType[]
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
