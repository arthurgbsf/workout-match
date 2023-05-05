import { Router, Response, Request } from "express";
import WorkoutsService from '../services/workouts.service'
import { IWorkout } from "../models/workout.model";
import { CustomError } from "../utils/customError.util";
import { auth } from "../middlewares/auth.middleware";
import { requiredFields } from "../middlewares/requiredFields.middleware";
import { validateFields } from "../middlewares/validateFields.middleware";

const router = Router();

router.get('/:id?', auth, async (req:Request, res:Response) => {
    try {
        const workoutId: string | undefined = req.params.id ? req.params.id : undefined;
        const user: Boolean = req.query.user ? Boolean(req.query.user) : false;
        const workouts = await WorkoutsService.getWorkout(req.headers['authorization'], user, workoutId);
        return res.status(200).send(workouts);
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

router.post('/', auth, validateFields<IWorkout>(["workout", "exercises"]), async (req:Request, res:Response) => {
    try {
        await WorkoutsService.create(req.body, req.headers['authorization']);
        return res.status(201).send({message: "Workout created."});
    } catch (error: any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

router.post('/:id', auth, async (req:Request, res:Response) => {
    try {
        await WorkoutsService.copy(req.headers['authorization'], req.params.id);
        return res.status(201).send({message: "Copied with success."});
    } catch (error: any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

router.put('/:id', auth, requiredFields<IWorkout>(["workout", "level", "exercises"]), async (req:Request, res:Response) => {
    try {
        await WorkoutsService.update(req.body, req.headers['authorization'], req.params.id);
        return res.status(200).send({message:"Workout updated."}); 
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

router.delete('/:id', auth, async (req:Request, res:Response) => {
    try {
        await WorkoutsService.remove( req.headers['authorization'], req.params.id);
        return res.status(200).send({message:"The workout was deleted with success."}); 
    } catch (error:any) {
        if(error instanceof CustomError){
            return res.status(error.code).send({message: error.message});
        };
        return res.status(400).send({message: error.message});
    }
});

export default router;