/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const dotenv = require('dotenv');
const { Pool } = require('pg');
dotenv.config();

const getPrefix = () => {
  let env = process.env.ENV;
  if (!env) {
    return (env = 'DEV');
  }
  return env;
};

const databaseConfig = () => {
  const env = getPrefix();
  return {
    username: process.env[`${env}_USERNAME`] || '',
    database: process.env[`${env}_DATABASE`] || '',
    password: process.env[`${env}_PASSWORD`] || '',
    host: process.env[`${env}_HOST`] || '',
    port: process.env[`${env}_PORT`] || 5432,
    dialect: 'postgres',
  };
};

module.exports = databaseConfig;

const pool = new Pool({
  user: databaseConfig().username,
  host: databaseConfig().host,
  database: databaseConfig().database,
  password: databaseConfig().password,
  port: databaseConfig().port,
  ssl: process.env[`${getPrefix()}_SSL`] === 'true' ? { rejectUnauthorized: false } : false,
});

module.exports = {
  databaseConfig,
  pool,
};
