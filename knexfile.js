require('dotenv').config(); // Ensure environment variables are loaded

// console.log(process.env.DATABASE_URL);

module.exports = {
  development: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
    },
    migrations: {
      directory: './src/migrations',
      tableName: 'knex_migrations',
    },
  },
};
