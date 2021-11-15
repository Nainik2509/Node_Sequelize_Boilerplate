const Joi = require("joi");

module.exports = {
  //  /api/v1/country/ --> Add Country
  // .unknown(true) --> To allow other fields
  AddCountry: {
    body: Joi.object().keys({
      name: Joi.string().required(),
    }),
  },

  //  /api/v1/country/ --> List Country
  GetCountry: {
    query: Joi.object().keys({
      page: Joi.number(),
      perPage: Joi.number(),
      counter: Joi.boolean(),
      search: Joi.any(),
    }),
  },

  //  /api/v1/country/:id --> Get country By ID, Delete/Update country
  ByIdParams: {
    params: Joi.object().keys({
      id: Joi.number().required(),
    }),
  },
};
