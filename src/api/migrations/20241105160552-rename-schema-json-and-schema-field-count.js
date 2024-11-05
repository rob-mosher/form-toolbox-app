/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('Templates', 'schemaJSON', 'formSchema')
    await queryInterface.renameColumn('Templates', 'schemaFieldCount', 'formSchemaCount')
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('Templates', 'formSchema', 'schemaJSON')
    await queryInterface.renameColumn('Templates', 'formSchemaCount', 'schemaFieldCount')
  },
}
