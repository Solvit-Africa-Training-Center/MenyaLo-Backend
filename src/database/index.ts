import { Sequelize } from 'sequelize';
import databaseConfig from './config/config';
import { AllModels } from './models';

interface ConfigInterface {
  username: string;
  password: string;
  database: string;
  port: number;
  host: string;
}

const dbConnection = (): Sequelize => {
  const db_config = databaseConfig() as ConfigInterface;
  const sequelize = new Sequelize({
    ...db_config,
    dialect: 'postgres',
  });
  return sequelize;
};

const sequelizeInstance = dbConnection();
const models = AllModels(sequelizeInstance);

Object.values(models).forEach((model) => {
  if (model?.associate) {
    model.associate(models);
  }
});

export const Database = {
  ...models,
  database: sequelizeInstance,
};
