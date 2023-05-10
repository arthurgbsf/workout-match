import { CustomError } from "../errors/customError.error";
import { notFound } from "../errors/errorResponses.error";
import { getToken } from "./getToken.utils";
import jwt from "jsonwebtoken";

export function getUserTokenId( headers:(string | undefined), secret:string){
    if(!headers){
        throw new CustomError(notFound.error2, notFound.code);
    }
    const userToken = getToken(headers);
    const authUser = jwt.verify(userToken, secret) as {_id:string};
    return authUser._id

};