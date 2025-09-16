/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const dotenv = require('dotenv');
dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT, PGSSLMODE } = process.env;

const databaseConfig = {
  username: PGUSER,
  password: PGPASSWORD,
  database: PGDATABASE,
  host: PGHOST,
  port: parseInt(PGPORT) || 5432,
  dialect: 'postgres',
  ssl: PGSSLMODE === 'true',
  dialectOptions: {
    ssl:
      PGSSLMODE === 'true'
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
  },
};

module.exports = databaseConfig;
