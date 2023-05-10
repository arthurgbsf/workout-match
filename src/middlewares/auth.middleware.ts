import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { UnauthorizedError } from "../errors/customError.error";
import { getToken } from '../utils/getToken.utils'
dotenv.config();

const secretJWT = process.env.JWT_SECRET_KEY || "";

export function auth(req:Request, res:Response, next:NextFunction){

    try {
        const token = getToken(req.headers['authorization']);
        const decoded = jwt.verify(token ,secretJWT);
        if(!decoded){
            throw new UnauthorizedError();
        }
        next(); 
    } catch (error:any) {
        next(error);
    }
};