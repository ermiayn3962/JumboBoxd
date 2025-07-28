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

module.exports = {accountCreationSchema};

