import {Router} from 'express';

import authRouter from './auth.router';
import usersRouter from './users.router';
import workoutsRouter from './workouts.router';
import exercisesRouter from './exercises.router';


const router = Router();

router.use('/auth', authRouter);

router.use('/users', usersRouter);

router.use('/training-data/workouts', workoutsRouter);

router.use('/training-data/exercises', exercisesRouter);

export default router;