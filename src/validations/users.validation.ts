import Joi from 'joi';

export const areRequired: Joi.SchemaFunction = (key) => key.required();
export const areForbbiden: Joi.SchemaFunction = (key) => key.forbidden();

export const userSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
    temporaryPassword: Joi.string(),
    temporaryPasswordExpiresAt: Joi.string()
}).or('name', 'email', 'password');

export const updateUserSchema = userSchema.fork(
    ['temporaryPassword','temporaryPasswordExpiresAt'], areForbbiden);

export const createUserSchema = userSchema.fork(
    ['name', 'email', 'password'], areRequired).fork(
    ['temporaryPassword','temporaryPasswordExpiresAt'], areForbbiden);

export const authUserSchema = userSchema.fork(
    ['email', 'password'], areRequired).fork(
    ['name','temporaryPassword','temporaryPasswordExpiresAt'], areForbbiden);

export const forgetPwdUserSchema = userSchema.fork(
    'email', areRequired). fork(
    ['name', 'password', 'temporaryPassword','temporaryPasswordExpiresAt'], areForbbiden);

export const changePwdUserSchema = userSchema.fork(
    ['temporaryPassword','password', 'email'], areRequired).fork(
    ['name', 'temporaryPasswordExpiresAt'], areForbbiden);