import { IExercise } from "../models/exercise.model";
import { CustomError } from "./customError.util";
import { getByIdAndCheck } from "./getByIdAndCheck.util";
import ExercisesRepository from "../repositories/exercises.repository";
import mongoose from "mongoose";

export  async function validateExercises(exercises: Array<mongoose.Types.ObjectId>, userId: string){

    if(exercises === undefined){
        throw new CustomError("Exercises not found.", 404);
    }

    for (const exerciseId of exercises){
            const exercise: IExercise = await getByIdAndCheck<IExercise>(exerciseId.toString(), ExercisesRepository.getById);
            if(exercise.createdBy.toString() !== userId){
                throw new Error(`You need to copy these exercises first : ${exerciseId}`);
            }
        }
};

