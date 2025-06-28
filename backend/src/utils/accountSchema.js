const joi = require('joi');

const accountBaseSchema = joi.object({
    firstName: joi.string(),
    lastName: joi.string(),
    email: joi.string(),
    password: joi.string(),
    id: joi.string()
});

const accountCreationSchema = accountBaseSchema.fork(
    ['firstName', 'lastName', 'email', 'password'],
    (schema) => schema.required()
);

const accountUpdateSchema = accountBaseSchema.fork(
    ['id'],
    (schema) => schema.required()
);

module.exports = {accountCreationSchema, accountUpdateSchema};

