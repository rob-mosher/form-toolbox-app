/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const seedData = [
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        isDeleted: false,
        name: '1099-MISC (Miscellaneous Information)',
        schemaJSON: JSON.stringify({
          "RECIPIENT'S name": { type: 'string', required: false },
          '1 Rents': { type: 'string', required: false },
          '2 Royalties': { type: 'string', required: false },
          '3 Other Income': { type: 'string', required: false },
          '4 Federal income tax withheld': { type: 'string', required: false },
          '5 Fishing boat proceeds': { type: 'string', required: false },
          '6 Medical and health care payments': { type: 'string', required: false },
          '7 Nonemployee compensation': { type: 'string', required: false },
          '8 Substitute payments in lieu of dividends or interest': { type: 'string', required: false },
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal('uuid_generate_v4()'),
        isDeleted: false,
        name: 'DS-82 (U.S. Passport Renewal)',
        schemaJSON: JSON.stringify({
          First: { type: 'string', required: false },
          Middle: { type: 'string', required: false },
          '1. Name Last': { type: 'string', required: false },
          '4. Place of Birth (City & State if in the U.S., or City & Country as it is presently known.)': { type: 'string', required: false },
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await queryInterface.bulkInsert('Templates', seedData, {})
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Templates', null, {})
  },
}
