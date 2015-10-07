
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
            table.increments('id').primary();
            table.string('username');
            table.string('password_hash');
            table.string('first_name');
            table.string('last_name');
            table.string('email');
            table.boolean('active');
            table.timestamps();
        });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
