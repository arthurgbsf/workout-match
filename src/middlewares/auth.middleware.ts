import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { CustomError } from "../errors/customError.error";
import { unauthorized } from "../errors/errorResponses.error";
import { getToken } from '../utils/getToken.utils'
dotenv.config();

const secretJWT = process.env.JWT_SECRET_KEY || "";

export function auth(req:Request, res:Response, next:NextFunction){

    try {
        const token = getToken(req.headers['authorization']);
        const decoded = jwt.verify(token ,secretJWT);
        if(!decoded){
            throw new CustomError(unauthorized.error0, unauthorized.code);
        }
        next(); 
    } catch (error:any) {
        next(error);
    }
};