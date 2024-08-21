// NOTE any changes to this model should be reflected in ../../../web/src/types/

/* eslint-disable lines-between-class-members */

import { DataTypes, Model, Sequelize } from 'sequelize'

interface FormModelType {
  id: string;
  analysisFolderNameS3?: string;
  exportFolderNameS3?: string;
  fileName?: string;
  fileNameS3?: string;
  formData?: object; // TODO consider being more specific
  isDeleted: boolean;
  pageCount?: number;
  status: 'analyzing' | 'error' | 'initialized' | 'ready' | 'uploading';
  templateId?: string;
  textractJobId?: string;
  textractKeyValueAndBoundingBoxes?: object; // Adjust the type if necessary
}

class FormModel extends Model<FormModelType> implements FormModelType {
  public id!: FormModelType['id']
  public analysisFolderNameS3?: FormModelType['analysisFolderNameS3']
  public exportFolderNameS3?: FormModelType['exportFolderNameS3']
  public fileName?: FormModelType['fileName']
  public fileNameS3?: FormModelType['fileNameS3']
  public formData?: FormModelType['formData']
  public isDeleted!: FormModelType['isDeleted']
  public pageCount?: FormModelType['pageCount']
  public status!: FormModelType['status']
  public templateId?: FormModelType['templateId']
  public textractJobId?: FormModelType['textractJobId']
  public textractKeyValueAndBoundingBoxes?: FormModelType['textractKeyValueAndBoundingBoxes']
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
          model: sequelize.models.Templates.tableName,
          key: 'id',
        },
      },
      textractJobId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      textractKeyValueAndBoundingBoxes: {
        type: DataTypes.JSONB,
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
