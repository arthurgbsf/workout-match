import {isValidObjectId} from "mongoose";
import { CustomError } from "../errors/customError.error";
import { badRequest } from "../errors/errorResponses.error";

export function objectIdCheck(id:string){

    if(!isValidObjectId(id)){
        throw new CustomError(badRequest.error1, badRequest.code);
    };
};