import { Sequelize } from 'sequelize'

const username = process.env.USERNAME as string;
const password = process.env.PASSWORD as string;
const host = process.env.HOST as string;
const dbname = process.env.DBNAME as string;

export const sequelize = new Sequelize(dbname, username, password, {
  host: host,
  dialect: "mysql",
  port: 3306,
  define: {
      paranoid: true
  },
  logging: false
});
