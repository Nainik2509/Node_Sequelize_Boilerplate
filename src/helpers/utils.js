const APIError = require("./api_error");
const { BAD_REQUEST, DUPLICATE_ERROR } = require("./constants");

exports.checkDuplication = async (data, model) => {
  if (data.name === "SequelizeUniqueConstraintError") {
    const errorObj = { ...data.errors[0] };
    const errors = [
      {
        field: errorObj.path,
        location: model,
        message: `${errorObj.value} is already added in ${model}!`,
      },
    ];
    var arr = new APIError(DUPLICATE_ERROR, errors, BAD_REQUEST);
    return arr;
  }
};
