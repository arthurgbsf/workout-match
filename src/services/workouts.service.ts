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
import { copyWorkoutExercises } from "../utils/copyWorkoutExercises.util";
import ExercisesRepository from "../repositories/exercises.repository";
import { getByIdAndCheck } from "../utils/getByIdAndCheck.util";
import { updateInWorkouts } from "../utils/updateInWorkouts.util";

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

        if(workout.exercises.length === 0){
            throw new Error("Is required at least one exercise.");
        }

        await validateExercises(workout.exercises, userId);

        workout.createdBy = new mongoose.Types.ObjectId(userId);

        const workoutWithDate: IWorkout = {...workout, createdAt: new Date()}

        const createdWorkout: IWorkout = await WorkoutsRepository.create(workoutWithDate);

        if(createdWorkout._id){
        await updateInWorkouts(createdWorkout.exercises, createdWorkout._id, ExercisesRepository.addInWorkout)

        await UsersRepository.updateMyWorkouts(userId, createdWorkout._id);

        return createdWorkout;
        
        }
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

        await updateInWorkouts(newWorkout.exercises, newWorkout._id ,ExercisesRepository.addInWorkout);

        await UsersRepository.updateMyWorkouts(userId, newWorkout._id);          
    };

    async update(workout: Partial<IWorkout>, headers:(string | undefined), workoutId:string){

        objectIdCheck(workoutId);

        const currentWorkout:IWorkout = await getByIdAndCheck(workoutId, WorkoutsRepository.getById);

        const userId:string = getUserTokenId(headers, secretJWT);

        if(userId !== currentWorkout.createdBy.toString()){
            throw new CustomError("this id is not linked to this user.", 401);
        };

        const workoutObjectId = new mongoose.Types.ObjectId(workoutId);

        const {addExercises, removeExercises,  ...noUpdateExercisesWorkout} = workout;

        if(noUpdateExercisesWorkout){

            const WorkoutWithUpdatedDate: Partial<IWorkout> = {...workout,
                updatedAt: moment(new Date()).locale('pt-br').format('L [às] LTS')};

            const result: UpdateWriteOpResult = await WorkoutsRepository.update(workoutId, WorkoutWithUpdatedDate);

            if(result.matchedCount === 0){
                throw new CustomError('Workout not found.', 404); 
            };
            if(result.modifiedCount === 0){
                throw new Error("Wasn't updated.");
            };
        };

        if(removeExercises){
            await updateInWorkouts(removeExercises, workoutObjectId, ExercisesRepository.removeInWorkout);
            await WorkoutsRepository.removeExercises(workoutObjectId, removeExercises);
           
        };

        if(addExercises){
                await validateExercises(addExercises, userId);
                await updateInWorkouts(addExercises, workoutObjectId, ExercisesRepository.addInWorkout);
                await WorkoutsRepository.addExercises(workoutObjectId, addExercises);

            };

    };

    async remove(headers:string | undefined, workoutId:string){

        objectIdCheck(workoutId);

        const currentWorkout:IWorkout = await getByIdAndCheck<IWorkout>(workoutId, WorkoutsRepository.getById);
        
        const userId:string = getUserTokenId(headers, secretJWT);

        if(userId !== currentWorkout.createdBy.toString()){
            throw new CustomError("This id is not linked to this user.", 401);
        }

        if(currentWorkout._id){
            
            await updateInWorkouts(currentWorkout.exercises, currentWorkout._id ,ExercisesRepository.removeInWorkout);

            await UsersRepository.removeMyWorkout(userId, new mongoose.Types.ObjectId(workoutId));
        };

        const result : DeleteResult = await WorkoutsRepository.remove(workoutId);

        if(result.deletedCount === 0){
            throw new Error("Wasn't deleted.");
        }; 
    }; 
};

export default new WorkoutsService;