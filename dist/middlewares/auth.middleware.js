"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const customError_error_1 = require("../errors/customError.error");
const errorResponses_error_1 = require("../errors/errorResponses.error");
const getToken_utils_1 = require("../utils/getToken.utils");
dotenv_1.default.config();
const secretJWT = process.env.JWT_SECRET_KEY || "";
function auth(req, res, next) {
    try {
        const token = (0, getToken_utils_1.getToken)(req.headers['authorization']);
        const decoded = jsonwebtoken_1.default.verify(token, secretJWT);
        if (!decoded) {
            throw new customError_error_1.CustomError(errorResponses_error_1.unauthorized.error0, errorResponses_error_1.unauthorized.code);
        }
        next();
    }
    catch (error) {
        next(error);
    }
}
exports.auth = auth;
;
