const { FormType } = require('../models');

const seedData = [
  {
    name: '1099-MISC (Miscellaneous Information)',
    // TODO change accounting types to 'number', 'step' to '0.01', and remove spaces and $ signs
    schema: JSON.stringify({
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
  },
  {
    name: 'DS-82 (U.S. Passport Renewal)',
    schema: JSON.stringify({
      First: { type: 'string', required: false },
      Middle: { type: 'string', required: false },
      '1. Name Last': { type: 'string', required: false },
      '4. Place of Birth (City & State if in the U.S., or City & Country as it is presently known.)': { type: 'string', required: false },
    }),
  },
];

const seedFormTypes = async () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const item of seedData) {
    // Check if the FormType already exists
    const formType = await FormType.findOne({ where: { name: item.name } });
    if (!formType) {
      // eslint-disable-next-line no-await-in-loop
      await FormType.create(item);
      console.log(`Seeded FormType: ${item.name}`);
    }
  }
};

module.exports = seedFormTypes;
