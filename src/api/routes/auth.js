const app = require("express").Router();
const { validate } = require("express-validation");
const { ADMIN } = require("../../helpers/constants");
const { Authorize } = require("../../middleware/auth");
const { Register } = require("../validations/auth");

app
  .route("/register")
  .post(Authorize(ADMIN), validate(Register), (req, res) => {});

module.exports = app;
