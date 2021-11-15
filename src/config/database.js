const { Sequelize } = require("sequelize");
const mysql = require("mysql2");
const { DB, USER, PASSWORD, HOST, DIALECT, DB_POOL } = require("./env_vars");
const logger = require("./logger");
// mysql
//   .createConnection({
//     user: USER,
//     password: PASSWORD,
//   })
//   .then(() => {
//     connection.query(`CREATE DATABASE IF NOT EXISTS ${DB};`).then(() => {
//       // Safe to use sequelize now
//     });
//   });

// Initialize Sequelize
// Connecting to a database
const sequelize = new Sequelize(DB, USER, PASSWORD, {
  host: HOST,
  dialect: DIALECT,
  operatorsAliases: 0,
  pool: DB_POOL, // Optional - Used for Sequelize connection pool configuration
  define: {
    // freezeTableName: true, // Enforcing the table name to be equal to the model name
  },
  logging: (msg) => logger.log("info", msg),
  //   logging: (...msg) => console.log(msg),
});

// Checking Connection with Database
sequelize
  .authenticate()
  .then(() => {
    logger.info("Connection has been established successfully.");
  })
  .catch((err) => {
    logger.error("Unable to connect to the database:", err);
  });

const db = {};

// exporting modules
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
