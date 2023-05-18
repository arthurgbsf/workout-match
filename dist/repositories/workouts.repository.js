"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const workout_model_1 = require("../models/workout.model");
class WorkoutsRepository {
    getAll(userId, user) {
        if (user) {
            return workout_model_1.Workout.find({ createdBy: { $eq: userId } }, { addExercises: 0, removeExercises: 0 }).populate({
                path: 'exercises',
                select: '-createdBy -inWorkouts -copiedExerciseId'
            });
        }
        ;
        return workout_model_1.Workout.find({ createdBy: { $ne: userId } }, { addExercises: 0, removeExercises: 0 }).populate({
            path: 'exercises',
            select: '-createdBy -inWorkouts -copiedExerciseId'
        });
    }
    ;
    getById(id) {
        return workout_model_1.Workout.findById({ _id: id }, { addExercises: 0, removeExercises: 0 }).populate({
            path: 'exercises',
            select: '-createdBy -inWorkouts -copiedExerciseId'
        });
    }
    ;
    create(workout) {
        return workout_model_1.Workout.create(workout);
    }
    ;
    update(id, workout) {
        return workout_model_1.Workout.updateOne({ _id: id }, { $set: workout });
    }
    ;
    remove(id) {
        return workout_model_1.Workout.deleteOne({ _id: id });
    }
    removeExercise(workoutId, exerciseId) {
        return workout_model_1.Workout.updateOne({ _id: workoutId }, { $pull: { exercises: exerciseId } });
    }
    addExercises(workoutId, toAddExercises) {
        return workout_model_1.Workout.updateOne({ _id: workoutId }, { $push: { exercises: { $each: toAddExercises } } });
    }
    removeExercises(workoutId, toRemoveExercises) {
        return workout_model_1.Workout.updateOne({ _id: workoutId }, { $pullAll: { exercises: toRemoveExercises } });
    }
}
;
exports.default = new WorkoutsRepository;
