exports.up = function (knex) {
    return knex.schema.createTable('tab_users', (t) => {
      t.increments();
      t.string('nome', 100).notNull().unique();
      t.string('email', 100).notNull();
      t.string('senha', 100).notNull();
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('tab_users');
  };