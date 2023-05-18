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
const exercise_model_1 = require("../models/exercise.model");
const getUserTokenId_util_1 = require("../utils/getUserTokenId.util");
const customError_error_1 = require("../errors/customError.error");
const errorResponses_error_1 = require("../errors/errorResponses.error");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const users_repository_1 = __importDefault(require("../repositories/users.repository"));
const objectIdCheck_util_1 = require("../utils/objectIdCheck.util");
const exercises_repository_1 = __importDefault(require("../repositories/exercises.repository"));
const workouts_repository_1 = __importDefault(require("../repositories/workouts.repository"));
const moment_1 = __importDefault(require("moment"));
const getByIdAndCheck_util_1 = require("../utils/getByIdAndCheck.util");
dotenv_1.default.config();
const secretJWT = process.env.JWT_SECRET_KEY || "";
class ExercisesService {
    getExercise(headers, user, exerciseId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (exerciseId) {
                (0, objectIdCheck_util_1.objectIdCheck)(exerciseId);
                const exercise = yield (0, getByIdAndCheck_util_1.getByIdAndCheck)(exerciseId, exercises_repository_1.default.getById);
                return exercise;
            }
            ;
            const userId = (0, getUserTokenId_util_1.getUserTokenId)(headers, secretJWT);
            const exercise = yield exercises_repository_1.default.getAll(userId, user);
            if (exercise.length === 0) {
                throw new customError_error_1.CustomError(errorResponses_error_1.notFound.error1, errorResponses_error_1.notFound.code);
            }
            ;
            return exercise;
        });
    }
    ;
    create(exercise, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = (0, getUserTokenId_util_1.getUserTokenId)(headers, secretJWT);
            exercise.createdBy = new mongoose_1.default.Types.ObjectId(userId);
            const exerciseWithDate = Object.assign(Object.assign({}, exercise), { createdAt: new Date() });
            const createdExercise = yield exercises_repository_1.default.create(exerciseWithDate);
            const createdExerciseId = createdExercise._id;
            if (createdExerciseId === undefined) {
                throw new customError_error_1.CustomError(errorResponses_error_1.badRequest.error4, errorResponses_error_1.badRequest.code);
            }
            yield users_repository_1.default.updateMyExercises(userId, createdExerciseId);
            return createdExercise;
        });
    }
    ;
    copy(headers, exerciseId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, objectIdCheck_util_1.objectIdCheck)(exerciseId);
            const userId = (0, getUserTokenId_util_1.getUserTokenId)(headers, secretJWT);
            const { exercise, sets, reps, type } = yield (0, getByIdAndCheck_util_1.getByIdAndCheck)(exerciseId, exercises_repository_1.default.getById);
            const copiedExercise = new exercise_model_1.Exercise({
                exercise: exercise,
                sets: sets,
                reps: reps,
                type: type,
                createdBy: new mongoose_1.default.Types.ObjectId(userId),
                copiedExerciseId: new mongoose_1.default.Types.ObjectId(exerciseId),
                createdAt: new Date()
            });
            const newExercise = yield exercises_repository_1.default.create(copiedExercise);
            yield users_repository_1.default.updateMyExercises(userId, newExercise._id);
            return newExercise;
        });
    }
    update(exercise, headers, exerciseId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, objectIdCheck_util_1.objectIdCheck)(exerciseId);
            const currentExercise = yield (0, getByIdAndCheck_util_1.getByIdAndCheck)(exerciseId, exercises_repository_1.default.getById);
            const userId = (0, getUserTokenId_util_1.getUserTokenId)(headers, secretJWT);
            if (userId !== currentExercise.createdBy.toString()) {
                throw new customError_error_1.CustomError(errorResponses_error_1.unauthorized.error0, errorResponses_error_1.unauthorized.code);
            }
            ;
            const exerciseWithUpdatedDate = Object.assign(Object.assign({}, exercise), { updatedAt: (0, moment_1.default)(new Date).locale("pt-br").format('L [às] LTS ') });
            const result = yield exercises_repository_1.default.update(exerciseId, exerciseWithUpdatedDate);
            if (result.matchedCount === 0) {
                throw new customError_error_1.CustomError(errorResponses_error_1.notFound.error0, errorResponses_error_1.notFound.code);
            }
            ;
            if (result.modifiedCount === 0) {
                throw new customError_error_1.CustomError(errorResponses_error_1.badRequest.error2, errorResponses_error_1.badRequest.code);
            }
            ;
        });
    }
    ;
    remove(headers, exerciseId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, objectIdCheck_util_1.objectIdCheck)(exerciseId);
            const currentExercise = yield (0, getByIdAndCheck_util_1.getByIdAndCheck)(exerciseId, exercises_repository_1.default.getById);
            if (currentExercise.inWorkouts !== undefined && currentExercise.inWorkouts.length !== 0)
                currentExercise.inWorkouts.forEach((workoutId) => __awaiter(this, void 0, void 0, function* () {
                    yield workouts_repository_1.default.removeExercise(workoutId, new mongoose_1.default.Types.ObjectId(exerciseId));
                }));
            const userId = (0, getUserTokenId_util_1.getUserTokenId)(headers, secretJWT);
            if (userId !== currentExercise.createdBy.toString()) {
                throw new customError_error_1.CustomError(errorResponses_error_1.unauthorized.error0, errorResponses_error_1.unauthorized.code);
            }
            const result = yield exercises_repository_1.default.remove(exerciseId);
            if (result.deletedCount === 0) {
                throw new customError_error_1.CustomError(errorResponses_error_1.badRequest.error3, errorResponses_error_1.badRequest.code);
            }
            ;
            yield users_repository_1.default.removeMyExercise(userId, new mongoose_1.default.Types.ObjectId(exerciseId));
        });
    }
    ;
}
;
exports.default = new ExercisesService;
