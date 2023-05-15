import * as Joi from  'joi';

export const areRequired: Joi.SchemaFunction = (key) => key.required();
export const areForbbiden: Joi.SchemaFunction = (key) => key.forbidden();

export const updateUserSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
    temporaryPassword: Joi.string(),
    temporaryPasswordExpiresAt: Joi.string()
}).or('name', 'email', 'password');

export const createUserSchema = updateUserSchema.fork(
    ['name', 'email', 'password'], areRequired).fork(
        ['temporaryPassword','temporaryPasswordExpiresAt'], areForbbiden);

export const authUserSchema = updateUserSchema.fork(
    ['email', 'password'], areRequired).fork(['name','temporaryPassword','temporaryPasswordExpiresAt'], areForbbiden);

export const forgetPwdUserSchema = updateUserSchema.fork(
    'email', areRequired). fork(['name', 'email', 'temporaryPassword','temporaryPasswordExpiresAt'], areForbbiden);

export const changePwdUserSchema = 