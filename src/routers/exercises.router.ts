import { Router, Response, Request, NextFunction } from "express";
import ExercisesService from "../services/exercises.service";
import { auth } from "../middlewares/auth.middleware";
import { updateExerciseSchema, createExerciseSchema } from "../validations/exercises.validation";
import { inputValidator } from "../middlewares/inputValidator.middleware";

const router = Router();

router.get('/', auth, async (req:Request, res:Response,  next:NextFunction) => {
    try {
        const user: Boolean = req.query.user ? Boolean(req.query.user) : false;
        const exercises = await ExercisesService.getExercise(req.headers['authorization'], user);
        return res.status(200).send(exercises);
    } catch (error:any) {
        next(error);
    }
});

router.get('/exercise/:id', auth, async (req:Request, res:Response,  next:NextFunction) => {
    try {
        const exercise = await ExercisesService.getExerciseById(req.headers['authorization'], req.params.id);
        return res.status(200).send(exercise);
    } catch (error:any) {
        next(error);
    }
});


router.post('/exercise', auth, inputValidator(createExerciseSchema), async (req:Request, res:Response, next:NextFunction) => {
    try {
        await ExercisesService.create(req.body, req.headers['authorization']);
        return res.status(201).send({message:"Exercise created."});
    } catch (error: any) {
        next(error);
    }
});

router.post('/exercise/:id', auth, async (req:Request, res:Response, next:NextFunction) => {
    try {
        await ExercisesService.copy(req.headers['authorization'], req.params.id);
        return res.status(201).send({message: "Copied with success."});
    } catch (error: any) {
        next(error);
    }
});

router.put('/exercise/:id', auth, inputValidator(updateExerciseSchema), async (req:Request, res:Response, next:NextFunction) => {
    try {
        await ExercisesService.update(req.body, req.headers['authorization'], req.params.id);
        return res.status(200).send({message:"Exercise updated. "}); 
    } catch (error:any) {
        next(error);
    }
});

router.delete('/exercise/:id', auth, async (req:Request, res:Response, next:NextFunction) => {
    try {
        await ExercisesService.remove( req.headers['authorization'], req.params.id);
        return res.status(200).send({message:"The exercise was deleted with success."}); 
    } catch (error:any) {
        next(error);
    }
});

export default router;