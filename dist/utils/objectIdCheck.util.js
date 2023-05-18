"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectIdCheck = void 0;
const mongoose_1 = require("mongoose");
const customError_error_1 = require("../errors/customError.error");
const errorResponses_error_1 = require("../errors/errorResponses.error");
function objectIdCheck(id) {
    if (!(0, mongoose_1.isValidObjectId)(id)) {
        throw new customError_error_1.CustomError(errorResponses_error_1.badRequest.error1, errorResponses_error_1.badRequest.code);
    }
    ;
}
exports.objectIdCheck = objectIdCheck;
;
