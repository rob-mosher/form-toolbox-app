/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add schemaFieldCount column
    await queryInterface.addColumn('Templates', 'schemaFieldCount', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    })

    // Add GIN index on schemaJSON
    await queryInterface.addIndex('Templates', ['schemaJSON'], {
      using: 'gin',
      name: 'templates_schema_json_idx',
    })

    // Create trigger function
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_schema_field_count()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW."schemaFieldCount" = (SELECT count(*) FROM jsonb_object_keys(NEW."schemaJSON"));
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER update_schema_field_count_trigger
      BEFORE INSERT OR UPDATE ON "Templates"
      FOR EACH ROW
      EXECUTE FUNCTION update_schema_field_count();

      -- Update existing rows
      UPDATE "Templates"
      SET "schemaFieldCount" = (SELECT count(*) FROM jsonb_object_keys("schemaJSON"));
    `)
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    // Remove trigger and function
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_schema_field_count_trigger ON "Templates";
      DROP FUNCTION IF EXISTS update_schema_field_count;
    `)

    // Remove the column
    await queryInterface.removeColumn('Templates', 'schemaFieldCount')

    // Remove the index
    await queryInterface.removeIndex('Templates', 'templates_schema_json_idx')
  },
}
