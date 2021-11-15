const app = require("express").Router();
const { validate } = require("express-validation");
const {
  AddCountry,
  GetCountry,
  ByIdParams,
} = require("../validations/country");
const model = require("../models/country");
const BaseController = require("../controllers/base");
const { Authorize } = require("../../middleware/auth");
const { ADMIN } = require("../../helpers/constants");

const controller = new BaseController(model, "Country");

app
  .route("/:id")
  .get(validate(ByIdParams), controller.get)
  .put(validate(ByIdParams), controller.update)
  .delete(validate(ByIdParams), controller.delete);

app.route("/").post(Authorize(ADMIN), validate(AddCountry), controller.add);

app.route("/").get(validate(GetCountry), controller.list);

module.exports = app;
