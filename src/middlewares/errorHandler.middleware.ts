import { Request, Response } from "express";
import { CustomError } from "../errors/customError.error";

function errorHandler(error: Error, req: Request, res: Response){
    if(error instanceof CustomError){
        return res.status(error.code).send({message: error.message});
    };
    return res.status(400).send({message: error.message});
};

export default errorHandler;