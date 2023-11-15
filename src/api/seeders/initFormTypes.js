const { FormType } = require('../models');

const seedData = [
  {
    name: '1099-MISC',
    schema: JSON.stringify({
      '1 Rents': { type: 'number', required: true },
      '2 Royalties': { type: 'number', required: true },
      '3 Other Income': { type: 'number', required: true },
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
