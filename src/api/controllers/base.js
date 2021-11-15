const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const APIError = require("../../helpers/api_error");
const {
  OK,
  RECORD_CREATED,
  NO_RECORD_FOUND,
  RECORDS_FOUND,
  RECORD_NOT_EXIST,
  BAD_REQUEST,
  RECORD_UPDATED,
  RECORD_DELETED,
  NO_RECORD,
} = require("../../helpers/constants");
const { ErrorHandler } = require("../../helpers/error_handler");
const { checkDuplication } = require("../../helpers/utils");

// Base Controller for CRUD
class BaseController {
  constructor(model, name) {
    this._model = model;
    this._name = name;
    this.reservedVars = ["page", "perPage", "counter", "search"];
    this.add = this.add.bind(this);
    this.list = this.list.bind(this);
    this.get = this.get.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  // Remove Keys from object
  removeReservedVars(queries, dissolvers) {
    return Object.keys(queries)
      .filter((obj) => dissolvers.indexOf(obj) === -1)
      .filter((obj) => !obj.startsWith("$"))
      .reduce((obj, key) => {
        obj[key] = queries[key];
        return obj;
      }, {});
  }

  // Add to Table
  async add(req, res, next) {
    try {
      // Insert Into Table Operation
      await this._model.create(req.body).then(
        (savedObject) => {
          return res
            .status(OK)
            .json({ data: savedObject, code: OK, message: RECORD_CREATED });
        },
        async (err) => {
          // Checking for unique constraint error
          const ConvertedError = await checkDuplication(err, this._name);
          return ErrorHandler(ConvertedError, req, res, next);
        }
      );
    } catch (error) {
      return next(error);
    }
  }

  async list(req, res, next) {
    try {
      let findQuery = this.removeReservedVars(req.query, this.reservedVars);
      let page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.perPage) || 10;

      // Handling Pagination
      if (limit && page)
        findQuery = { ...findQuery, limit, offset: 0 + (page - 1) * limit };

      // Handle Common Search
      if (req.query.search) {
        const modelConstructure = new this._model();
        modelConstructure.searchable().forEach((element) => {
          req.query[`$${element}`] = req.query.search;
        });
      }
      let searchVars = Object.keys(req.query)
        .filter((obj) => obj.startsWith("$"))
        .reduce((obj, key) => {
          obj[key.replace("$", "")] = {
            [Op.like]: `%${req.query.search}%`,
          };
          return obj;
        }, {});

      if (Object.keys(searchVars).length > 0) {
        const tempArr = Object.entries(searchVars).map((e) => ({
          [e[0]]: e[1],
        }));
        const searchObj = {
          where: {
            [Op.or]: [...tempArr],
          },
        };
        findQuery = { ...findQuery, ...searchObj };
      }

      // Fetching record from Table
      await this._model.findAll(findQuery).then(
        async (savedObject) => {
          // Giving Count if user request for counter
          if (req.query.counter) var count = await this._model.count({});

          return res.status(OK).json({
            data: savedObject,
            code: OK,
            count,
            message: savedObject.length > 0 ? RECORDS_FOUND : NO_RECORD_FOUND,
          });
        },
        async (err) => {
          throw err;
        }
      );
    } catch (error) {
      return next(error);
    }
  }

  async get(req, res, next) {
    try {
      let id = req.params.id;
      // Retrieving Record from table By ID
      await this._model.findByPk(id).then(
        async (savedObject) => {
          return res.status(OK).json({
            data: savedObject,
            code: OK,
            message: savedObject ? RECORDS_FOUND : NO_RECORD,
          });
        },
        async (err) => {
          throw err;
        }
      );
    } catch (error) {
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      let id = req.params.id;
      // Checking if Record is there or not in table
      let updateObj = await this._model.findByPk(id);
      if (!updateObj) {
        throw new APIError(RECORD_NOT_EXIST, null, BAD_REQUEST);
      }

      // Updating Record in table
      await this._model.update(req.body, {
        where: { id },
      });
      // Fetching Record by ID
      await this._model.findByPk(id).then(
        async (savedObject) => {
          return res.status(OK).json({
            data: savedObject,
            code: OK,
            message: RECORD_UPDATED,
          });
        },
        async (err) => {
          throw err;
        }
      );
    } catch (error) {
      // Checking for unique constraint error
      if (error.name === "SequelizeUniqueConstraintError") {
        const ConvertedError = await checkDuplication(error, this._name);
        return ErrorHandler(ConvertedError, req, res, next);
      }
      return next(error);
    }
  }

  async delete(req, res, next) {
    try {
      let id = req.params.id;

      // Checking if Record is there or not in table
      let deleteObj = await this._model.findByPk(id);
      if (!deleteObj) {
        throw new APIError(RECORD_NOT_EXIST, null, BAD_REQUEST);
      }
      // Deleting Record from table
      await this._model.destroy({
        where: { id },
      });
      return res.status(OK).json({
        code: OK,
        message: RECORD_DELETED,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = BaseController;
