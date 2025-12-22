const { Sequelize } = require('sequelize');
require('dotenv').config();

const isDevelopment = process.env.NODE_ENV !== 'development';
const dbType = process.env.DB_TYPE || 'sqlite';

let sequelize;

if (dbType === 'mysql') {
  sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT || 3306,
      dialect: 'mysql',
      logging: isDevelopment ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: false // Set to true if you want automatic createdAt/updatedAt
      }
    }
  );
} else {
  // SQLite for local development
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.SQLITE_PATH || './middleware/database/dataStorage.db',
    logging: isDevelopment ? console.log : false,
    define: {
      timestamps: false
    }
  });
}

module.exports = sequelize;
