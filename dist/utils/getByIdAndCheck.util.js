"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getByIdAndCheck = void 0;
const customError_error_1 = require("../errors/customError.error");
const errorResponses_error_1 = require("../errors/errorResponses.error");
const getByIdAndCheck = (id, repositoryMethod) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield repositoryMethod(id);
    if (!document) {
        throw new customError_error_1.CustomError(errorResponses_error_1.notFound.error0, errorResponses_error_1.notFound.code);
    }
    ;
    return document;
});
exports.getByIdAndCheck = getByIdAndCheck;
