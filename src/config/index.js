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
  },

  passport: {
    username: process.env.username,
    password: process.env.password,
  },

  nodemailer: {
    username: process.env.username,
    pass: process.env.pass,
  },

  ipstack: {
    access_key: process.env.access_key
  }
};