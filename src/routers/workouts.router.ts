import { Router, Response, Request, NextFunction } from "express";
import WorkoutsService from '../services/workouts.service'
import { auth } from "../middlewares/auth.middleware";
import { inputValidator } from "../middlewares/inputValidator.middleware";
import { updateWorkoutSchema, createWorkoutSchema } from "../validations/workouts.validation";

const router = Router();

router.get('/:id?', auth, async (req:Request, res:Response, next:NextFunction) => {
    try {
        const workoutId: string | undefined = req.params.id ? req.params.id : undefined;
        const user: Boolean = req.query.user ? Boolean(req.query.user) : false;
        const workouts = await WorkoutsService.getWorkout(req.headers['authorization'], user, workoutId);
        return res.status(200).send(workouts);
    } catch (error:any) {
        next(error);
    }
});

router.post('/', auth, inputValidator(createWorkoutSchema), async (req:Request, res:Response, next:NextFunction) => {
    try {
        await WorkoutsService.create(req.body, req.headers['authorization']);
        return res.status(201).send({message: "Workout created."});
    } catch (error: any) {
        next(error);
    }
});

router.post('/:id', auth, async (req:Request, res:Response, next:NextFunction) => {
    try {
        await WorkoutsService.copy(req.headers['authorization'], req.params.id);
        return res.status(201).send({message: "Copied with success."});
    } catch (error: any) {
        next(error);
    }
});

router.put('/:id', auth, inputValidator(updateWorkoutSchema), async (req:Request, res:Response, next:NextFunction) => {
    try {
        await WorkoutsService.update(req.body, req.headers['authorization'], req.params.id);
        return res.status(200).send({message:"Workout updated."}); 
    } catch (error:any) {
        next(error);
    }
});

router.delete('/:id', auth, async (req:Request, res:Response, next:NextFunction) => {
    try {
        await WorkoutsService.remove( req.headers['authorization'], req.params.id);
        return res.status(200).send({message:"The workout was deleted with success."}); 
    } catch (error:any) {
        next(error);
    }
});

export default router;