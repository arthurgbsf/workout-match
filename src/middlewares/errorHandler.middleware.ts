import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/customError.error";

export function errorHandler(error:Error | CustomError, req: Request, res: Response, next: NextFunction){
    if(error instanceof CustomError){
        return res.status(error.code).send({message: error.message});
    };
    return res.status(400).send({message: error.message});
};
