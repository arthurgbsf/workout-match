import WorkoutsRepository from "../repositories/workouts.repository";
import { IWorkout, Workout } from '../models/workout.model';
import { getUserTokenId } from "../utils/getUserTokenId.util";
import { CustomError } from "../utils/customError.util";
import mongoose, {UpdateWriteOpResult} from "mongoose";
import {DeleteResult} from 'mongodb';
import dotenv from 'dotenv';
import UsersRepository from "../repositories/users.repository";
import { objectIdCheck } from "../utils/objectIdCheck.util";
import { IUser} from "../models/user.model";
import moment from "moment";
import { validateExercises } from "../utils/validateExercises.util";
import { setRefWorkoutInExercise } from "../utils/setRefWorkoutInExercise.util";
import { copyWorkoutExercises } from "../utils/copyWorkoutExercises.util";
import { removeRefWorkoutInExercise } from "../utils/removeRefWorkoutInExercise.util";
import ExercisesRepository from "../repositories/exercises.repository";
import { getByIdAndCheck } from "../utils/getByIdAndCheck.util";

dotenv.config();
const secretJWT = process.env.JWT_SECRET_KEY || "";

class WorkoutsService{

    async getWorkout(headers:(string|undefined), user: Boolean, workoutId:(string|undefined)){
        if(workoutId){
            objectIdCheck(workoutId);
            const workout: IWorkout = await getByIdAndCheck<IWorkout>(workoutId, WorkoutsRepository.getById);
            return workout;
        }; 
        const userId:string = getUserTokenId(headers, secretJWT);
        const workouts: Array<IWorkout> = await WorkoutsRepository.getAll(userId, user);
        if(workouts.length === 0){
            throw new CustomError('No Workouts avaible.', 404);
        };
        return workouts;
    };

    async create(workout: IWorkout, headers:(string|undefined)){

        const userId:string = getUserTokenId(headers, secretJWT);

        const user:IUser =  await getByIdAndCheck<IUser>(userId, UsersRepository.getById);

        if((user.myCreatedExercises !== undefined) && (user.myCreatedExercises.length === 0)){
            throw new Error("To create a workout is required have exercises.");
        }
        
        await validateExercises(workout, userId);

        workout.createdBy = new mongoose.Types.ObjectId(userId);

        const workoutWithDate: IWorkout = {...workout, createdAt: new Date()}

        const createdWorkout: IWorkout = await WorkoutsRepository.create(workoutWithDate);

        const createdWorkoutId = await setRefWorkoutInExercise(createdWorkout);

        await UsersRepository.updateMyWorkouts(userId, createdWorkoutId);

        return createdWorkout;       
    };

    async copy(headers:(string|undefined), workoutId:string){

        objectIdCheck(workoutId);

        const userId:string = getUserTokenId(headers, secretJWT);

        const toCopyWorkout: IWorkout = await getByIdAndCheck<IWorkout>(workoutId, WorkoutsRepository.getById);

        const copiedExercisesIds = await copyWorkoutExercises(toCopyWorkout, headers);
        
        const {workout, level} = toCopyWorkout;

        const copiedWorkout: IWorkout = new Workout({
            workout: workout,
            level: level, 
            exercises: copiedExercisesIds,
            createdBy: new mongoose.Types.ObjectId(userId) ,
            copiedWorkoutId: new mongoose.Types.ObjectId(workoutId),
            createdAt: new Date()
        });
       
        const newWorkout = await WorkoutsRepository.create(copiedWorkout);

        await setRefWorkoutInExercise(newWorkout);

        await UsersRepository.updateMyWorkouts(userId, newWorkout._id);
              
    };

    async update(workout: Partial<IWorkout>, headers:(string | undefined), workoutId:string){

        objectIdCheck(workoutId);

        const currentWorkout:IWorkout = await getByIdAndCheck(workoutId, WorkoutsRepository.getById);

        const userId:string = getUserTokenId(headers, secretJWT);

        if(userId !== currentWorkout.createdBy.toString()){
            throw new CustomError("this id is not linked to this user.", 401);
        };
        
        if(workout.exercises){

            await validateExercises(workout, userId);

            const workoutExercises = workout.exercises

            if(workoutExercises === undefined){
                throw new CustomError("Exercises not found.", 404);
            }

            const addedExerciseIds = workoutExercises.filter(
                id => !currentWorkout.exercises.includes(id)) ?? [];

            const removedExerciseIds = currentWorkout.exercises.filter(
                id => !workoutExercises.includes(id) ?? []);

            const WorkoutWithUpdatedDate: Partial<IWorkout> = {...workout,
                exercises: workout.exercises, 
                updatedAt: moment(new Date()).locale('pt-br').format('L [às] LTS ')};
            
            const addPromises = addedExerciseIds.map(exerciseId => ExercisesRepository.addInWorkout(exerciseId, new mongoose.Types.ObjectId(workoutId)));
            const removePromises = removedExerciseIds.map(exerciseId => ExercisesRepository.removeInWorkout(exerciseId, new mongoose.Types.ObjectId(workoutId)));
         
            await Promise.all([...addPromises, ...removePromises]);
                
            const result: UpdateWriteOpResult = await WorkoutsRepository.update(workoutId, WorkoutWithUpdatedDate);
 
            if(result.matchedCount === 0){
                throw new CustomError('Workout not found.', 404); 
            };
            if(result.modifiedCount === 0){
                throw new Error("Wasn't updated.");
            };

        }else{
            
            const WorkoutWithUpdatedDate: Partial<IWorkout> = {...workout,
                updatedAt: moment(new Date()).locale('pt-br').format('L [às] LTS ')};
            const result: UpdateWriteOpResult = await WorkoutsRepository.update(workoutId, WorkoutWithUpdatedDate);
            if(result.matchedCount === 0){
                throw new CustomError('Workout not found.', 404); 
            };
            if(result.modifiedCount === 0){
                throw new CustomError("Wasn't updated.");
            };
        }

    };

    async remove(headers:string | undefined, workoutId:string){

        objectIdCheck(workoutId);

        const currentWorkout:IWorkout = await getByIdAndCheck<IWorkout>(workoutId, WorkoutsRepository.getById);
        
        const userId:string = getUserTokenId(headers, secretJWT);

        if(userId !== currentWorkout.createdBy.toString()){
            throw new CustomError("This id is not linked to this user.", 401);
        }

        const result : DeleteResult = await WorkoutsRepository.remove(workoutId);

        if(result.deletedCount === 0){
            throw new Error("Wasn't deleted.");
        }; 
        await removeRefWorkoutInExercise(currentWorkout);
        await UsersRepository.removeMyWorkout(userId, new mongoose.Types.ObjectId(workoutId));
    };
};

export default new WorkoutsService;