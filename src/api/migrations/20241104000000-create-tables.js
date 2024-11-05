/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Enable UUID extension
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')

    // Create Templates table
    await queryInterface.createTable('Templates', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      // intentional line break for classifying the entries
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      schemaJSON: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      // intentional line break for classifying the entries
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })

    // Create Forms table
    await queryInterface.createTable('Forms', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      // intentional line break for classifying the entries
      analysisFolderNameS3: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fileNameOriginal: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fileNameS3: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      formDeclared: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      formDetected: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      pageCount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      previewFolderNameS3: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM,
        values: ['analyzing', 'error', 'initializing', 'ready', 'uploading'],
        allowNull: false,
      },
      templateId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Templates',
          key: 'id',
        },
      },
      textractJobId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      uploadFolderNameS3: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      // intentional line break for classifying the entries
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Forms')
    await queryInterface.dropTable('Templates')

    // Drop the UUID extension since no other tables are using it
    await queryInterface.sequelize.query('DROP EXTENSION IF EXISTS "uuid-ossp";')
  },
}
