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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const workouts_repository_1 = __importDefault(require("../repositories/workouts.repository"));
const workout_model_1 = require("../models/workout.model");
const getUserTokenId_util_1 = require("../utils/getUserTokenId.util");
const customError_error_1 = require("../errors/customError.error");
const errorResponses_error_1 = require("../errors/errorResponses.error");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const users_repository_1 = __importDefault(require("../repositories/users.repository"));
const objectIdCheck_util_1 = require("../utils/objectIdCheck.util");
const moment_1 = __importDefault(require("moment"));
const validateExercises_util_1 = require("../utils/validateExercises.util");
const copyWorkoutExercises_util_1 = require("../utils/copyWorkoutExercises.util");
const exercises_repository_1 = __importDefault(require("../repositories/exercises.repository"));
const getByIdAndCheck_util_1 = require("../utils/getByIdAndCheck.util");
const updateInWorkouts_util_1 = require("../utils/updateInWorkouts.util");
dotenv_1.default.config();
const secretJWT = process.env.JWT_SECRET_KEY || "";
class WorkoutsService {
    getWorkout(headers, user, workoutId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (workoutId) {
                (0, objectIdCheck_util_1.objectIdCheck)(workoutId);
                const workout = yield (0, getByIdAndCheck_util_1.getByIdAndCheck)(workoutId, workouts_repository_1.default.getById);
                return workout;
            }
            ;
            const userId = (0, getUserTokenId_util_1.getUserTokenId)(headers, secretJWT);
            const workouts = yield workouts_repository_1.default.getAll(userId, user);
            if (workouts.length === 0) {
                throw new customError_error_1.CustomError(errorResponses_error_1.notFound.error1, errorResponses_error_1.notFound.code);
            }
            ;
            return workouts;
        });
    }
    ;
    create(workout, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = (0, getUserTokenId_util_1.getUserTokenId)(headers, secretJWT);
            const user = yield (0, getByIdAndCheck_util_1.getByIdAndCheck)(userId, users_repository_1.default.getById);
            if ((user.myCreatedExercises !== undefined) && (user.myCreatedExercises.length === 0)) {
                throw new customError_error_1.CustomError(errorResponses_error_1.unauthorized.error1, errorResponses_error_1.unauthorized.code);
            }
            if (workout.exercises.length === 0) {
                throw new customError_error_1.CustomError(errorResponses_error_1.unauthorized.error2, errorResponses_error_1.unauthorized.code);
            }
            yield (0, validateExercises_util_1.validateExercises)(workout.exercises, userId);
            workout.createdBy = new mongoose_1.default.Types.ObjectId(userId);
            const workoutWithDate = Object.assign(Object.assign({}, workout), { createdAt: new Date() });
            const newWorkout = yield workouts_repository_1.default.create(workoutWithDate);
            if (!newWorkout._id) {
                throw new customError_error_1.CustomError(errorResponses_error_1.badRequest.error4, errorResponses_error_1.badRequest.code);
            }
            ;
            yield (0, updateInWorkouts_util_1.updateInWorkouts)(newWorkout.exercises, newWorkout._id, exercises_repository_1.default.addInWorkout);
            yield users_repository_1.default.updateMyWorkouts(userId, newWorkout._id);
        });
    }
    ;
    copy(headers, workoutId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, objectIdCheck_util_1.objectIdCheck)(workoutId);
            const userId = (0, getUserTokenId_util_1.getUserTokenId)(headers, secretJWT);
            const toCopyWorkout = yield (0, getByIdAndCheck_util_1.getByIdAndCheck)(workoutId, workouts_repository_1.default.getById);
            const copiedExercisesIds = yield (0, copyWorkoutExercises_util_1.copyWorkoutExercises)(toCopyWorkout, headers);
            const { workout, level } = toCopyWorkout;
            const copiedWorkout = new workout_model_1.Workout({
                workout: workout,
                level: level,
                exercises: copiedExercisesIds,
                createdBy: new mongoose_1.default.Types.ObjectId(userId),
                copiedWorkoutId: new mongoose_1.default.Types.ObjectId(workoutId),
                createdAt: new Date()
            });
            const newWorkout = yield workouts_repository_1.default.create(copiedWorkout);
            if (!newWorkout._id) {
                throw new customError_error_1.CustomError(errorResponses_error_1.badRequest.error4, errorResponses_error_1.badRequest.code);
            }
            ;
            yield (0, updateInWorkouts_util_1.updateInWorkouts)(newWorkout.exercises, newWorkout._id, exercises_repository_1.default.addInWorkout);
            yield users_repository_1.default.updateMyWorkouts(userId, newWorkout._id);
        });
    }
    ;
    update(workout, headers, workoutId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, objectIdCheck_util_1.objectIdCheck)(workoutId);
            const currentWorkout = yield (0, getByIdAndCheck_util_1.getByIdAndCheck)(workoutId, workouts_repository_1.default.getById);
            const userId = (0, getUserTokenId_util_1.getUserTokenId)(headers, secretJWT);
            if (userId !== currentWorkout.createdBy.toString()) {
                throw new customError_error_1.CustomError(errorResponses_error_1.unauthorized.error0, errorResponses_error_1.unauthorized.code);
            }
            ;
            const workoutObjectId = new mongoose_1.default.Types.ObjectId(workoutId);
            const { addExercises, removeExercises } = workout, noUpdateExercisesWorkout = __rest(workout, ["addExercises", "removeExercises"]);
            if (noUpdateExercisesWorkout) {
                const WorkoutWithUpdatedDate = Object.assign(Object.assign({}, workout), { updatedAt: (0, moment_1.default)(new Date()).locale('pt-br').format('L [às] LTS') });
                const result = yield workouts_repository_1.default.update(workoutId, WorkoutWithUpdatedDate);
                if (result.matchedCount === 0) {
                    throw new customError_error_1.CustomError(errorResponses_error_1.notFound.error0, errorResponses_error_1.notFound.code);
                }
                ;
                if (result.modifiedCount === 0) {
                    throw new customError_error_1.CustomError(errorResponses_error_1.badRequest.error2, errorResponses_error_1.badRequest.code);
                }
                ;
            }
            ;
            if (removeExercises) {
                yield (0, updateInWorkouts_util_1.updateInWorkouts)(removeExercises, workoutObjectId, exercises_repository_1.default.removeInWorkout);
                yield workouts_repository_1.default.removeExercises(workoutObjectId, removeExercises);
            }
            ;
            if (addExercises) {
                yield (0, validateExercises_util_1.validateExercises)(addExercises, userId);
                yield (0, updateInWorkouts_util_1.updateInWorkouts)(addExercises, workoutObjectId, exercises_repository_1.default.addInWorkout);
                yield workouts_repository_1.default.addExercises(workoutObjectId, addExercises);
            }
            ;
        });
    }
    ;
    remove(headers, workoutId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, objectIdCheck_util_1.objectIdCheck)(workoutId);
            const currentWorkout = yield (0, getByIdAndCheck_util_1.getByIdAndCheck)(workoutId, workouts_repository_1.default.getById);
            const userId = (0, getUserTokenId_util_1.getUserTokenId)(headers, secretJWT);
            if (userId !== currentWorkout.createdBy.toString()) {
                throw new customError_error_1.CustomError(errorResponses_error_1.unauthorized.error0, errorResponses_error_1.unauthorized.code);
            }
            if (currentWorkout._id) {
                yield (0, updateInWorkouts_util_1.updateInWorkouts)(currentWorkout.exercises, currentWorkout._id, exercises_repository_1.default.removeInWorkout);
                yield users_repository_1.default.removeMyWorkout(userId, new mongoose_1.default.Types.ObjectId(workoutId));
            }
            ;
            const result = yield workouts_repository_1.default.remove(workoutId);
            if (result.deletedCount === 0) {
                throw new customError_error_1.CustomError(errorResponses_error_1.badRequest.error3, errorResponses_error_1.badRequest.code);
            }
            ;
        });
    }
    ;
}
;
exports.default = new WorkoutsService;
