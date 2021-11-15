const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

// Setting Environment variables
module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  DB: process.env.DB,
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
  HOST: process.env.HOST,
  DIALECT: process.env.DIALECT,
  DB_POOL: {
    max: 5, // maximum number of connection in pool
    min: 0, // minimum number of connection in pool
    acquire: 30000, // maximum time, in milliseconds, that a connection can be idle before being released
    idle: 10000, // maximum time, in milliseconds, that pool will try to get connection before throwing error
  },
  Level: process.env.NODE_ENV === "development" ? "debug" : "error", // logging priority
  JWT_SECRET: process.env.JWT_SECRET,
};
