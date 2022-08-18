import { Dialect, Sequelize } from 'sequelize'


//const dbName = process.env.DB_NAME as string;
//const dbUser = process.env.DB_USER as string;
//const dbHost = process.env.DB_HOST as string;
//const dbPassword = process.env.DB_PASSWORD as string;

export const sequelize = new Sequelize("testdb", "root", "Zzzhbr1111", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
  dialectOptions: {
    socketPath: "/var/run/mysqld/mysqld.sock"
  },
  define: {
      paranoid: true
  },
  logging: false
});
