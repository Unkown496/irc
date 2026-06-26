import database from 'config/database';
import { Sequelize } from 'sequelize';

const orm = new Sequelize(database.url, {
  dialect: 'postgres',
});

orm.sync();

export default orm;
