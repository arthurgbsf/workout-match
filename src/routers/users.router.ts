import { Router, Response, Request, NextFunction} from "express";
import UsersService from "../services/users.service";
import { auth } from "../middlewares/auth.middleware";
import { inputValidator } from "../middlewares/inputValidator.middleware";
import { createUserSchema, authUserSchema, updateUserSchema } from "../validations/uses.validation";

const router = Router();

router.get('/:id?', auth, async (req:Request, res:Response, next:NextFunction) => {
    try {
        const userId: string | undefined = req.params.id ? req.params.id : undefined;
        const user: Boolean = req.query.user ? Boolean(req.query.user) : false;
        const users = await UsersService.getUser(req.headers['authorization'], user, userId);
        return res.status(200).send(users);
    } catch (error:any) {
        next(error);
    }
});

router.post('/user', inputValidator(createUserSchema) , async (req:Request, res:Response, next:NextFunction) => {
    try {
        await UsersService.create(req.body);
        return res.status(201).send({message: "User created."});
    } catch (error: any) {
        next(error);
    }
});

router.post('/authentication', inputValidator(authUserSchema), async (req:Request, res:Response, next:NextFunction) => {
    try {
        const token = await UsersService.auth(req.body.email, req.body.password);
        return res.status(200).send({token});
    } catch (error:any) {
        next(error);
    }
})

router.put('/user', auth, inputValidator(updateUserSchema), async (req:Request, res:Response, next:NextFunction) => {
    try {
        await UsersService.update(req.body, req.headers['authorization']);
        return res.status(200).send({message:"User updated."}); 
    } catch (error:any) {
        next(error);
    }
});

router.delete('/user', auth, async (req:Request, res:Response, next:NextFunction) => {
    try {
        await UsersService.remove( req.headers['authorization']);
        req.headers['authorization'] = undefined;
        return res.status(200).send({message:"The user was deleted."}); 
    } catch (error:any) {
        next(error);
    }
});

export default router;