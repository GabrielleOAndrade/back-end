exports.up = function (knex) {
  return knex.schema.createTable('tab_persons', (t) => {
    t.increments();
    t.string('nome', 100).notNull().unique();
    t.string('numero', 100).notNull();
    t.string('email', 100).notNull();
    t.string('endereco', 200).notNull();
    t.date('data_nascimento', 20).notNull();
    t.string('foto', 100).notNull();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tab_persons');
};