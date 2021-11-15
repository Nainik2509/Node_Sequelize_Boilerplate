const { ValidationError } = require("express-validation");
const APIError = require("./api_error");
const { VALIDATION_ERROR, BAD_REQUEST } = require("./constants");

const Handler = (err, req, res, next) => {
  // Response Object
  const response = {
    code: err.status,
    message: err.message,
    errors: err.errors,
  };
  res.status(err.status).json(response);
  res.end();
};

exports.ErrorHandler = Handler;

exports.ValidationErrorHandler = (err, req, res, next) => {
  let ConvertedError = err;
  // Instance of JOI Validation Errors
  if (err instanceof ValidationError) {
    const getError = [];
    // Map all path errors
    Object.keys(err.details).map((data) => {
      const errors = err.details[data].map((e) => ({
        location: data,
        message: e.message.replace(/[^\w\s]/gi, ""),
        field: e.path[0],
      }));
      if (errors && errors.length > 0) getError.push(errors[0]);
    });
    // Generating Error Response Structure
    ConvertedError = new APIError(
      VALIDATION_ERROR,
      getError,
      err.status || BAD_REQUEST
    );
  } else if (!(err instanceof APIError)) {
    ConvertedError = new APIError(err.message, err.stack, err.status);
  }
  return Handler(ConvertedError, req, res, next);
};
