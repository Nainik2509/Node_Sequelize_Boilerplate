const express = require("express");
const fs = require("fs");
const app = express.Router();

module.exports = fs.readdirSync(__dirname + "/").forEach(function (file) {
  if (file !== "index.js" && file.substr(-3) == ".js") {
    const routeName = file.replace(".js", "");
    app.use("/" + routeName, require("./" + routeName));
  }
});

module.exports = app;
