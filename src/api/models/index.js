const fs = require("fs");
const db = require("../../config/database");
const logger = require("../../config/logger");

// an asynchronous function
db.sequelize
  // Synchronization in production can be destructive So it should be done with Migrations
  .sync({
    alter: true, // This checks what is the current state of the table in the database (which columns it has, what are their data types, etc),
    // and then performs the necessary changes in the table to make it match the model.
    // force: true // This creates the table, dropping it first if it already existed
  })
  .then(() => {
    logger.info("DB Droped, Resync and created");
  });

// Exports all models
module.exports = fs.readdirSync(__dirname + "/").forEach(function (file) {
  // Reading all files except index
  if (file !== "index.js" && file.substr(-3) === ".js") {
    const modelName = file.replace(".js", "");
    modelName: require("./" + modelName);
  }
});
