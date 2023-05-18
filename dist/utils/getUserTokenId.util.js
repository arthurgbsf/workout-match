"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserTokenId = void 0;
const customError_error_1 = require("../errors/customError.error");
const errorResponses_error_1 = require("../errors/errorResponses.error");
const getToken_utils_1 = require("./getToken.utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getUserTokenId(headers, secret) {
    if (!headers) {
        throw new customError_error_1.CustomError(errorResponses_error_1.notFound.error2, errorResponses_error_1.notFound.code);
    }
    const userToken = (0, getToken_utils_1.getToken)(headers);
    const authUser = jsonwebtoken_1.default.verify(userToken, secret);
    return authUser._id;
}
exports.getUserTokenId = getUserTokenId;
;
