/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const orderedFields = [
      "RECIPIENT'S name",
      '1 Rents',
      '2 Royalties',
      '3 Other Income',
      '4 Federal income tax withheld',
      '5 Fishing boat proceeds',
      '6 Medical and health care payments',
      '7 Nonemployee compensation',
      '8 Substitute payments in lieu of dividends or interest',
    ]

    // Note: Using template name is both needed and safe here because:
    // 1. needed: id is random (and uuidv4 at that) so it's not a reliable basis for comparison
    // 2. safe: We're only concerned with the initial seed data
    // 3. safe: This migration runs after the seed migration
    // 4. safe: Template names aren't guaranteed unique in general, but are unique in our seed data
    await queryInterface.sequelize.query(`
      UPDATE "Templates"
      SET "formSchemaOrder" = :order
      WHERE name = '1099-MISC (Miscellaneous Information)'
      AND NOT "isDeleted"
    `, {
      replacements: {
        order: JSON.stringify(orderedFields),
      },
      type: Sequelize.QueryTypes.UPDATE,
    })
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    // No action needed: when rolling back to before formSchemaOrder existed, the current order
    // (whatever it is) doesn't matter, 'ordered' or not
  },
}
