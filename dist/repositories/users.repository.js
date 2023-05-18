"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../models/user.model");
class UsersRepository {
    getAll(userId, user, projections) {
        if (user) {
            return user_model_1.User.find({ _id: userId }, projections);
        }
        ;
        return user_model_1.User.find({ _id: { $ne: userId } }, projections);
    }
    ;
    getByEmail(email) {
        return user_model_1.User.findOne({ email: email });
    }
    ;
    getOne(filter) {
        return user_model_1.User.findOne(filter);
    }
    ;
    getById(id) {
        return user_model_1.User.findById({ _id: id }, { _id: 1, name: 1, email: 1 });
    }
    ;
    create(user) {
        return user_model_1.User.create(user);
    }
    ;
    update(id, user) {
        return user_model_1.User.updateOne({ _id: id }, { $set: user });
    }
    ;
    remove(id) {
        return user_model_1.User.deleteOne({ _id: id });
    }
    updateMyWorkouts(userId, workoutId) {
        return user_model_1.User.updateOne({ _id: userId }, { $push: { myCreatedWorkouts: workoutId } });
    }
    removeMyWorkout(userId, workoutId) {
        return user_model_1.User.updateOne({ _id: userId }, { $pull: { myCreatedWorkouts: workoutId } });
    }
    updateMyExercises(userId, exerciseId) {
        return user_model_1.User.updateOne({ _id: userId }, { $push: { myCreatedExercises: exerciseId } });
    }
    removeMyExercise(userId, exerciseId) {
        return user_model_1.User.updateOne({ _id: userId }, { $pull: { myCreatedExercises: exerciseId } });
    }
}
;
exports.default = new UsersRepository;
