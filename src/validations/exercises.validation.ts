import * as Joi from  'joi';
import { areRequired } from './uses.validation';

export const updateExerciseSchema = Joi.object({
    exercise: Joi.string(),
    sets: Joi.string(),
    reps: Joi.string(),
    type: Joi.string()
}).or('exercise', 'sets', 'reps', 'type');

export const createExerciseSchema = updateExerciseSchema.fork(
    ['exercise', 'sets', 'reps', 'type'], areRequired);