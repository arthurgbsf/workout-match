import { Workout, IWorkout } from "../models/workout.model";
import mongoose from "mongoose";
import {ObjectId} from 'mongoose';

class WorkoutsRepository{

    getAll(userId:string, user: Boolean){

        if(user){ 
            return Workout.find({ createdBy: { $eq: userId }}).populate({
                path:'exercises',
                select: '-createdBy -inWorkouts -copiedExerciseId'})};
        return Workout.find(
            { createdBy: { $ne: userId }}
            ).populate({
                path:'exercises',
                select: '-createdBy -inWorkouts -copiedExerciseId'});
    };

    getById(id:string){
        return Workout.findById({_id:id}).populate({
            path:'exercises',
            select: '-createdBy -inWorkouts -copiedExerciseId'});
    };

    create(workout:IWorkout){
        return Workout.create(workout);
    };

    update(id: string, workout:Partial<IWorkout>){
        return Workout.updateOne({_id:id}, {$set:workout});
    };

    remove(id: string){
        return Workout.deleteOne({_id:id});
    }

    addExercise(workoutId: ObjectId, exerciseId:  mongoose.Types.ObjectId){
        return Workout.updateOne({id:workoutId}, {$push: {exercises: exerciseId}});
    }

    removeExercise(workoutId: ObjectId, exerciseId:  mongoose.Types.ObjectId){
        return Workout.updateOne({id:workoutId}, {$pull: {exercises: exerciseId}});
    }

    addExercises(workoutId: ObjectId | mongoose.Types.ObjectId, toAddExercises:  Array<mongoose.Types.ObjectId>){
        return Workout.updateOne({id:workoutId}, {$push: {exercises:{ $each: toAddExercises}}});
    }

    removeExercises(workoutId: ObjectId | mongoose.Types.ObjectId, toRemoveExercises:  Array<mongoose.Types.ObjectId>){
        return Workout.updateOne({id:workoutId}, {$pullAll: {exercises: toRemoveExercises}});
    }

};

export default new WorkoutsRepository;

