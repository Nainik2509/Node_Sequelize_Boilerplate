const Joi = require("joi");

module.exports = {
  //  /api/v1/role/add --> Add Role
  // .unknown(true) --> To allow other fields
  AddRole: {
    body: Joi.object().keys({
      name: Joi.string().required(),
    }),
  },

  //  /api/v1/role/list --> List Role
  GetRole: {
    query: Joi.object().keys({
      page: Joi.number(),
      perPage: Joi.number(),
      counter: Joi.boolean(),
    }),
  },

  //  /api/v1/role/:id --> Get role By ID, Delete/Update role
  ByIdParams: {
    params: Joi.object().keys({
      id: Joi.number().required(),
    }),
  },
};
