import * as Joi from  'joi';

export const areRequired: Joi.SchemaFunction = (key) => key.required();
export const areForbbiden: Joi.SchemaFunction = (key) => key.forbidden();

export const updateUserSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
}).or('name', 'email', 'password');

export const createUserSchema = updateUserSchema.fork(
    ['name', 'email', 'password'], areRequired);

export const authUserSchema = updateUserSchema.fork(
    ['email', 'password'], areRequired).fork('name', areForbbiden);

