
import * as Joi from  'joi';
import {Request, Response, NextFunction} from "express";

export const inputValidator = (validation: Joi.Schema ) => {
    return (req:Request, res:Response, next:NextFunction) => {
        try {
            const result = validation.validate(req.body);
            if(result.error){
                throw new Error(result.error.message);
            }
            next();
        } catch (error) {
            next(error);
        }

    }
}
