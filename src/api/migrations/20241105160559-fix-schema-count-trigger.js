// This migration is necessary to fix the trigger function for the formSchemaCount column after
// schemaJSON was renamed to formSchema.

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async up(queryInterface, Sequelize) {
    // Drop the existing trigger and function
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_schema_field_count_trigger ON "Templates";
      DROP FUNCTION IF EXISTS update_schema_field_count;

      -- Create new trigger function with correct column names
      CREATE OR REPLACE FUNCTION update_schema_field_count()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW."formSchemaCount" = (SELECT count(*) FROM jsonb_object_keys(NEW."formSchema"));
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER update_schema_field_count_trigger
      BEFORE INSERT OR UPDATE ON "Templates"
      FOR EACH ROW
      EXECUTE FUNCTION update_schema_field_count();
    `)
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    // Drop the trigger and function
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_schema_field_count_trigger ON "Templates";
      DROP FUNCTION IF EXISTS update_schema_field_count;

      -- Recreate trigger function with original column names
      CREATE OR REPLACE FUNCTION update_schema_field_count()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW."formSchemaCount" = (SELECT count(*) FROM jsonb_object_keys(NEW."formSchema"));
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER update_schema_field_count_trigger
      BEFORE INSERT OR UPDATE ON "Templates"
      FOR EACH ROW
      EXECUTE FUNCTION update_schema_field_count();
    `)
  },
}
