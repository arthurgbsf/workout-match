import { IExercise } from "../models/exercise.model";
import { CustomError } from "../errors/customError.error";
import { badRequest, unauthorized } from "../errors/errorResponses.error";
import { getByIdAndCheck } from "./getByIdAndCheck.util";
import ExercisesRepository from "../repositories/exercises.repository";
import mongoose from "mongoose";

export  async function validateExercises(exercises: Array<mongoose.Types.ObjectId>, userId: string){

    if(exercises === undefined){
        throw new CustomError(badRequest.error4, badRequest.code);
    }

    for (const exerciseId of exercises){
            const exercise: IExercise = await getByIdAndCheck<IExercise>(exerciseId.toString(), ExercisesRepository.getById);
            if(exercise.createdBy.toString() !== userId){
                throw new CustomError(unauthorized.error3, unauthorized.code);
            }
        }
};

