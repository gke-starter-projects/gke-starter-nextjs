/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable('tweets', (table) => {
  table.increments('id').primary(); // Primary key, auto-increments
  table.integer('user_id').unsigned().notNullable();
  table.foreign('user_id').references('users.id').onDelete('CASCADE');
  table.string('content', 280).notNullable(); // Twitter's character limit
  table.timestamp('created_at').defaultTo(knex.fn.now());
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable('tweets');
