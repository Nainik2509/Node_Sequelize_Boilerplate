const app = require("express").Router();
const { validate } = require("express-validation");
const { AddRole, GetRole, ByIdParams } = require("../validations/role");
const model = require("../models/role");
const BaseController = require("../controllers/base");

const controller = new BaseController(model, "Role");

app
  .route("/:id")
  .get(validate(ByIdParams), controller.get)
  .put(validate(ByIdParams), controller.update)
  .delete(validate(ByIdParams), controller.delete);

app.route("/").post(validate(AddRole), controller.add);

app.route("/").get(validate(GetRole), controller.list);

module.exports = app;
