const Joi = require("joi");
const { AUTH_ROLES, USER_STATUS } = require("../../helpers/constants");

module.exports = {
  Register: {
    body: Joi.object().keys({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      roleId: Joi.string().valid(...AUTH_ROLES.values()),
      status: Joi.string().valid(...USER_STATUS.values()),
    }),
  },
};
