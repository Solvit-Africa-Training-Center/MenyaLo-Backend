/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const dotenv = require('dotenv');
dotenv.config();

const env = process.env.NODE_ENV || 'development';
const databaseConfig = {
  dialect: 'postgres',
};

if (env === 'development') {
  Object.assign(databaseConfig, {
    username: process.env.DEV_USERNAME,
    database: process.env.DEV_DATABASE,
    password: process.env.DEV_PASSWORD,
    host: process.env.DEV_HOST,
    port: process.env.DEV_PORT || 5432,
  });
} else if(env === 'production') {
  const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT, PGSSLMODE } = process.env;

  Object.assign(databaseConfig, {
    username: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
    host: PGHOST,
    port: parseInt(PGPORT) || 5432,
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
  });
}

module.exports = databaseConfig;
