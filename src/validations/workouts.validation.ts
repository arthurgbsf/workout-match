import * as Joi from 'joi';
import { areForbbiden, areRequired} from './uses.validation';

export const workoutSchema = Joi.object({
    workout: Joi.string(),
    level: Joi. string(),
    exercises: Joi.array(),
    addExercises: Joi.array(),
    removeExercises: Joi.array()
});

export const updateWorkoutSchema = workoutSchema.fork(
    'exercises', areForbbiden
    ).or("workout", "level", "addExercises", "removeExercises");

export const  createWorkoutSchema = workoutSchema.fork(
    ['workout', 'exercises'], areRequired).fork(
        ['addExercises', 'removeExercises'], areForbbiden);