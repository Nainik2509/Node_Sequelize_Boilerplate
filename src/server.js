const http = require("http");
const app = require("./config/app");
const { env, port, HOST, USER, PASSWORD, DB } = require("./config/env_vars");
const logger = require("./config/logger");
const mysql = require("mysql2/promise");

//Create Express web Server
const server = http.createServer(app);
server.listen(port);

// On server Listening
server.on("listening", async () => {
  // Connecting with MySql
  const connection = await mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
  });
  // Create DataBase if it doesn't exist
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB}\`;`);
  // Connecting with the Database
  require("./api/models/");
  logger.info(`We're flying on ${`${env.toUpperCase()}_${port}`}`);
});

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = `Port ${port}`;
  switch (error.code) {
    case "EADDRINUSE":
      logger.error(`${bind} is already in use`);
      process.exit(1);
    case "ECONNREFUSED":
      logger.error(`Unable to connect with the database server`);
      process.exit(1);
    default:
      throw error;
  }
};

server.on("error", onError);
