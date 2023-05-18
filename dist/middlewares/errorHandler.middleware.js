"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const customError_error_1 = require("../errors/customError.error");
function errorHandler(error, req, res, next) {
    if (error instanceof customError_error_1.CustomError) {
        return res.status(error.code).send({ message: error.message });
    }
    ;
    return res.status(400).send({ message: error.message });
}
exports.errorHandler = errorHandler;
;
