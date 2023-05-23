import WorkoutsRepository from "../repositories/workouts.repository";
import { IWorkout, Workout } from '../models/workout.model';
import { getUserTokenId } from "../utils/getUserTokenId.util";
import { CustomError } from "../errors/customError.error";
import { badRequest, notFound, unauthorized } from "../errors/errorResponses.error";
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

    async getWorkout(headers:(string|undefined), user: Boolean){

        const userId:string = getUserTokenId(headers, secretJWT);
        const workouts: Array<IWorkout> = await WorkoutsRepository.getAll(userId, user);
        if(workouts.length === 0){
            throw new CustomError(notFound.error1, notFound.code);
        };
        return workouts;
    };

    async getWorkoutById(headers:(string|undefined), workoutId: string){
      
        objectIdCheck(workoutId);
        const workout: IWorkout = await getByIdAndCheck<IWorkout>(workoutId, WorkoutsRepository.getById);
        return workout;
        
    };

    async create(workout: IWorkout, headers:(string|undefined)){

        const userId:string = getUserTokenId(headers, secretJWT);

        const user:IUser =  await getByIdAndCheck<IUser>(userId, UsersRepository.getById);

        if((user.myCreatedExercises !== undefined) && (user.myCreatedExercises.length === 0)){
            throw new CustomError(unauthorized.error1, unauthorized.code);
        }

        if(workout.exercises.length === 0){
            throw new CustomError(unauthorized.error2, unauthorized.code);
        }

        await validateExercises(workout.exercises, userId);

        workout.createdBy = new mongoose.Types.ObjectId(userId);

        const workoutWithDate: IWorkout = {...workout, createdAt: new Date()}

        const newWorkout: IWorkout = await WorkoutsRepository.create(workoutWithDate);

        if(!newWorkout._id){
            throw new CustomError(badRequest.error4, badRequest.code);
        };

        await updateInWorkouts(newWorkout.exercises, newWorkout._id, ExercisesRepository.addInWorkout)

        await UsersRepository.updateMyWorkouts(userId, newWorkout._id);
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
       
        const newWorkout: IWorkout = await WorkoutsRepository.create(copiedWorkout);

        if(!newWorkout._id){
            throw new CustomError(badRequest.error4, badRequest.code);
        };

        await updateInWorkouts(newWorkout.exercises, newWorkout._id ,ExercisesRepository.addInWorkout);

        await UsersRepository.updateMyWorkouts(userId, newWorkout._id);          
    };

    async update(workout: Partial<IWorkout>, headers:(string | undefined), workoutId:string){

        objectIdCheck(workoutId);

        const currentWorkout:IWorkout = await getByIdAndCheck(workoutId, WorkoutsRepository.getById);

        const userId:string = getUserTokenId(headers, secretJWT);

        if(userId !== currentWorkout.createdBy.toString()){
            throw new CustomError(unauthorized.error0, unauthorized.code);
        };

        const workoutObjectId = new mongoose.Types.ObjectId(workoutId);

        const {addExercises, removeExercises,  ...noUpdateExercisesWorkout} = workout;

        if(noUpdateExercisesWorkout){

            const WorkoutWithUpdatedDate: Partial<IWorkout> = {...workout,
                updatedAt: moment(new Date()).locale('pt-br').format('L [às] LTS')};

            const result: UpdateWriteOpResult = await WorkoutsRepository.update(workoutId, WorkoutWithUpdatedDate);

            if(result.matchedCount === 0){
                throw new CustomError(notFound.error0, notFound.code); 
            };
            if(result.modifiedCount === 0){
                throw new CustomError(badRequest.error2, badRequest.code);
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
            throw new CustomError(unauthorized.error0, unauthorized.code);
        }

        if(currentWorkout._id){
            
            await updateInWorkouts(currentWorkout.exercises, currentWorkout._id ,ExercisesRepository.removeInWorkout);

            await UsersRepository.removeMyWorkout(userId, new mongoose.Types.ObjectId(workoutId));
        };

        const result : DeleteResult = await WorkoutsRepository.remove(workoutId);

        if(result.deletedCount === 0){
            throw new CustomError(badRequest.error3, badRequest.code);
        }; 
    }; 
};

export default new WorkoutsService;