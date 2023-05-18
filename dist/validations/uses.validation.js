"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePwdUserSchema = exports.forgetPwdUserSchema = exports.authUserSchema = exports.createUserSchema = exports.updateUserSchema = exports.areForbbiden = exports.areRequired = void 0;
const joi_1 = __importDefault(require("joi"));
const areRequired = (key) => key.required();
exports.areRequired = areRequired;
const areForbbiden = (key) => key.forbidden();
exports.areForbbiden = areForbbiden;
exports.updateUserSchema = joi_1.default.object({
    name: joi_1.default.string(),
    email: joi_1.default.string().email(),
    password: joi_1.default.string(),
    temporaryPassword: joi_1.default.string(),
    temporaryPasswordExpiresAt: joi_1.default.string()
}).or('name', 'email', 'password');
exports.createUserSchema = exports.updateUserSchema.fork(['name', 'email', 'password'], exports.areRequired).fork(['temporaryPassword', 'temporaryPasswordExpiresAt'], exports.areForbbiden);
exports.authUserSchema = exports.updateUserSchema.fork(['email', 'password'], exports.areRequired).fork(['name', 'temporaryPassword', 'temporaryPasswordExpiresAt'], exports.areForbbiden);
exports.forgetPwdUserSchema = exports.updateUserSchema.fork('email', exports.areRequired).fork(['name', 'password', 'temporaryPassword', 'temporaryPasswordExpiresAt'], exports.areForbbiden);
exports.changePwdUserSchema = exports.updateUserSchema.fork(['temporaryPassword', 'password', 'password'], exports.areRequired).fork(['name', 'temporaryPasswordExpiresAt'], exports.areForbbiden);
