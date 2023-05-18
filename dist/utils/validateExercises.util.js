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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateExercises = void 0;
const customError_error_1 = require("../errors/customError.error");
const errorResponses_error_1 = require("../errors/errorResponses.error");
const getByIdAndCheck_util_1 = require("./getByIdAndCheck.util");
const exercises_repository_1 = __importDefault(require("../repositories/exercises.repository"));
function validateExercises(exercises, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (exercises === undefined) {
            throw new customError_error_1.CustomError(errorResponses_error_1.badRequest.error4, errorResponses_error_1.badRequest.code);
        }
        for (const exerciseId of exercises) {
            const exercise = yield (0, getByIdAndCheck_util_1.getByIdAndCheck)(exerciseId.toString(), exercises_repository_1.default.getById);
            if (exercise.createdBy.toString() !== userId) {
                throw new customError_error_1.CustomError(errorResponses_error_1.unauthorized.error3, errorResponses_error_1.unauthorized.code);
            }
        }
    });
}
exports.validateExercises = validateExercises;
;
