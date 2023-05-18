"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = void 0;
const customError_error_1 = require("../errors/customError.error");
const errorResponses_error_1 = require("../errors/errorResponses.error");
function getToken(token) {
    if (!token) {
        throw new customError_error_1.CustomError(errorResponses_error_1.unauthorized.error0, errorResponses_error_1.unauthorized.code);
    }
    const splitedToken = token.split('Bearer ');
    const code = splitedToken[1];
    return code;
}
exports.getToken = getToken;
