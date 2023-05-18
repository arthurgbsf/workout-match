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
exports.copyWorkoutExercises = void 0;
const exercises_service_1 = __importDefault(require("../services/exercises.service"));
function copyWorkoutExercises(workout, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        const exercises = workout.exercises.map((exercise) => __awaiter(this, void 0, void 0, function* () {
            const copiedExercise = yield exercises_service_1.default.copy(headers, exercise._id.toString());
            return copiedExercise._id;
        }));
        const exercisesIds = yield Promise.all(exercises);
        return exercisesIds;
    });
}
exports.copyWorkoutExercises = copyWorkoutExercises;
;
