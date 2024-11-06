/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Templates', 'formSchemaOrder', {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: [],
    })

    const templates = await queryInterface.sequelize.query(
      'SELECT id, "formSchema" FROM "Templates"',
      { type: Sequelize.QueryTypes.SELECT },
    )

    const updatePromises = templates.map((template) => {
      const schemaKeys = Object.keys(template.formSchema)
      return queryInterface.sequelize.query(
        'UPDATE "Templates" SET "formSchemaOrder" = :order WHERE id = :id',
        {
          replacements: {
            order: JSON.stringify(schemaKeys),
            id: template.id,
          },
          type: Sequelize.QueryTypes.UPDATE,
        },
      )
    })

    await Promise.all(updatePromises)
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Templates', 'formSchemaOrder')
  },
}
