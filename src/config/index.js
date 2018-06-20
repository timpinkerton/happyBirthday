require('dotenv').config();

module.exports = {
  appName: 'Happy Birthday',
  port: 3838,

  //including the mongo configuration from .env
  db: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host:     process.env.DB_HOST,
    dbName:   process.env.DB_NAME,
  }
};