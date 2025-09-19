const dotenv = require('dotenv');
const { Pool } = require('pg');
dotenv.config();

// 1️⃣ Define databaseConfig first
const getPrefix = () => process.env.ENV || 'DEV';

const databaseConfig = () => {
  const env = getPrefix();
  return {
    username: process.env[`${env}_USERNAME`] || '',
    password: process.env[`${env}_PASSWORD`] || '',
    database: process.env[`${env}_DATABASE`] || '',
    host: process.env[`${env}_HOST`] || '',
    port: parseInt(process.env[`${env}_PORT`] || '5432', 10),
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env[`${env}_SSL`] === 'true'
        ? { rejectUnauthorized: false }
        : false
    }
  };
};

// 2️⃣ Define pool after databaseConfig
const pool = new Pool({
  user: databaseConfig().username,
  host: databaseConfig().host,
  database: databaseConfig().database,
  password: databaseConfig().password,
  port: databaseConfig().port,
  ssl: process.env[`${getPrefix()}_SSL`] === 'true' ? { rejectUnauthorized: false } : false
});

// 3️⃣ Export AFTER defining variables
module.exports = {
  databaseConfig,
  pool,
};
