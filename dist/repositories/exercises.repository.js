"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exercise_model_1 = require("../models/exercise.model");
class ExercisesRepository {
    getAll(userId, user) {
        if (user) {
            return exercise_model_1.Exercise.find({ createdBy: { $eq: userId } });
        }
        ;
        return exercise_model_1.Exercise.find({ copiedExerciseId: { $exists: false }, createdBy: { $ne: userId } }, { inWorkouts: 0 });
    }
    ;
    getById(id) {
        return exercise_model_1.Exercise.findById({ _id: id });
    }
    ;
    create(exercise) {
        return exercise_model_1.Exercise.create(exercise);
    }
    ;
    update(id, exercise) {
        return exercise_model_1.Exercise.updateOne({ _id: id }, { $set: exercise });
    }
    ;
    remove(id) {
        return exercise_model_1.Exercise.deleteOne({ _id: id });
    }
    addInWorkout(exerciseId, workoutId) {
        return exercise_model_1.Exercise.updateOne({ _id: exerciseId, inWorkouts: { $nin: [workoutId] } }, { $addToSet: { inWorkouts: workoutId } });
    }
    removeInWorkout(exerciseId, workoutId) {
        return exercise_model_1.Exercise.updateOne({ _id: exerciseId }, { $pull: { inWorkouts: workoutId } });
    }
}
;
exports.default = new ExercisesRepository;
