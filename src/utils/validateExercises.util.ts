
import { IWorkout } from "../models/workout.model";
import { IExercise } from "../models/exercise.model";
import { CustomError } from "./customError.util";
import { getByIdAndCheck } from "./getByIdAndCheck.util";
import ExercisesRepository from "../repositories/exercises.repository";

export  async function validateExercises(workout: IWorkout | Partial<IWorkout>, userId: string){

    if(workout.exercises === undefined){
        throw new CustomError("Exercises not found.", 404);
    }

    if(workout.exercises.length === 0){
        throw new Error("Is required at least one exercise.");
    }

    for (const exerciseId of workout.exercises){
            const exercise: IExercise = await getByIdAndCheck<IExercise>(exerciseId.toString(), ExercisesRepository.getById);
            if(exercise.createdBy.toString() !== userId){
                throw new Error(`You need to copy these exercises first : ${exerciseId}`);
            }
        }
};

