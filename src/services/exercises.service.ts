import { Exercise, IExercise } from "../models/exercise.model";
import { getUserTokenId } from "../utils/getUserTokenId.util";
import { CustomError } from "../errors/customError.error";
import { badRequest, notFound, unauthorized } from "../errors/errorResponses.error";
import mongoose, {ObjectId, UpdateWriteOpResult} from "mongoose";
import {DeleteResult} from 'mongodb';
import dotenv from 'dotenv';
import UsersRepository from "../repositories/users.repository";
import { objectIdCheck } from "../utils/objectIdCheck.util";
import ExercisesRepository from "../repositories/exercises.repository";
import WorkoutsRepository from "../repositories/workouts.repository";
import moment from "moment";
import { getByIdAndCheck } from "../utils/getByIdAndCheck.util";

dotenv.config();
const secretJWT = process.env.JWT_SECRET_KEY || "";

class ExercisesService{

    async getExercise(headers: string|undefined , user: Boolean, exerciseId: string | undefined){
        if(exerciseId){
            objectIdCheck(exerciseId);
            const exercise: IExercise = await getByIdAndCheck<IExercise>(exerciseId, ExercisesRepository.getById);
            return exercise;
        }; 
        const userId:string = getUserTokenId(headers, secretJWT);
        const exercise: Array<IExercise> = await ExercisesRepository.getAll(userId, user);
        if(exercise.length === 0){
            throw new CustomError(notFound.error1, notFound.code);
        };
        return exercise;
    };

    async create(exercise: IExercise, headers:(string|undefined)){

            const userId:string = getUserTokenId(headers, secretJWT);

            exercise.createdBy = new mongoose.Types.ObjectId(userId);

            const exerciseWithDate: IExercise = {...exercise, createdAt: new Date()}

            const createdExercise: IExercise = await ExercisesRepository.create(exerciseWithDate);
            const createdExerciseId: (ObjectId | undefined) = createdExercise._id

            if (createdExerciseId === undefined) {
                throw new CustomError(badRequest.error4, badRequest.code);
            }

            await UsersRepository.updateMyExercises(userId,createdExerciseId);
            
            return createdExercise ;       
    };

    async copy(headers: string|undefined , exerciseId:string){
        
        objectIdCheck(exerciseId);

        const userId:string = getUserTokenId(headers, secretJWT);

        const {exercise,sets, reps, type} = await getByIdAndCheck<IExercise>(exerciseId, ExercisesRepository.getById);

        const copiedExercise: IExercise = new Exercise({
            exercise: exercise,
            sets: sets, 
            reps: reps, 
            type: type,
            createdBy: new mongoose.Types.ObjectId(userId) ,
            copiedExerciseId: new mongoose.Types.ObjectId(exerciseId),
            createdAt: new Date()
        });
       
        const newExercise = await ExercisesRepository.create(copiedExercise);

        await UsersRepository.updateMyExercises(userId, newExercise._id);

        return newExercise;
    }

    async update(exercise: Partial<IExercise>, headers:(string | undefined), exerciseId:string){

        objectIdCheck(exerciseId);

        const currentExercise: IExercise =  await getByIdAndCheck<IExercise>(exerciseId, ExercisesRepository.getById);

        const userId:string = getUserTokenId(headers, secretJWT);

        if(userId !== currentExercise.createdBy.toString()){
            throw new CustomError(unauthorized.error0, unauthorized.code);
        };

        const exerciseWithUpdatedDate: Partial<IExercise> = {...exercise,
            updatedAt: moment(new Date).locale("pt-br").format('L [às] LTS ')};

        const result: UpdateWriteOpResult = await ExercisesRepository.update(exerciseId, exerciseWithUpdatedDate);
        if(result.matchedCount === 0){
            throw new CustomError(notFound.error0, notFound.code); 
        };
        if(result.modifiedCount === 0){
            throw new CustomError(badRequest.error2, badRequest.code);
        };
    };

    async remove(headers:string | undefined, exerciseId:string){

        objectIdCheck(exerciseId);

        const currentExercise: IExercise =  await getByIdAndCheck<IExercise>(exerciseId, ExercisesRepository.getById);

        if(currentExercise.inWorkouts !== undefined && currentExercise.inWorkouts.length !== 0)
            currentExercise.inWorkouts.forEach( async (workoutId ) => {
                await WorkoutsRepository.removeExercise(workoutId, new mongoose.Types.ObjectId(exerciseId));
        });
        
        const userId:string = getUserTokenId(headers, secretJWT);

        if(userId !== currentExercise.createdBy.toString()){
            throw new CustomError(unauthorized.error0, unauthorized.code);
        }

        const result : DeleteResult = await ExercisesRepository.remove(exerciseId);

        if(result.deletedCount === 0){
            throw new CustomError(badRequest.error3, badRequest.code);
        }; 

        await UsersRepository.removeMyExercise(userId, new mongoose.Types.ObjectId(exerciseId));
    };
};

export default new ExercisesService;