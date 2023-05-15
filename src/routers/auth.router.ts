import { Router, Request, Response, NextFunction  } from "express";
import { inputValidator } from "../middlewares/inputValidator.middleware";
import { authUserSchema, forgetPwdUserSchema } from "../validations/uses.validation";
import AuthsService from "../services/auths.service";

const router = Router();

router.post('/login', inputValidator(authUserSchema), async (req:Request, res:Response, next:NextFunction) => {
    try {
        const token = await AuthsService.auth(req.body.email, req.body.password);
        return res.status(200).send({token});
    } catch (error:any) {
        next(error);
    }
})
router.post('/forget_password', inputValidator(forgetPwdUserSchema), async (req:Request, res:Response, next:NextFunction) => {
    try {
         await AuthsService.recoveryPassword(req.body);
        return res.status(200).send({ message: 'Email successfully sent.' });
    } catch (error:any) {
        next(error);
    }
})


export default router;

