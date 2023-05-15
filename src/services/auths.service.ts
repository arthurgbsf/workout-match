import { IUser } from "../models/user.model";
import crypto from 'crypto';
import UsersRepository from "../repositories/users.repository";
import { CustomError } from "../errors/customError.error";
import { unauthorized, notFound } from "../errors/errorResponses.error";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

dotenv.config();
const secretJWT = process.env.JWT_SECRET_KEY || "";

class AuthsService{

    async auth(email:string, password:string){

        const user: (IUser | null) = await UsersRepository.getByEmail(email);
        if(user === null){
            throw new CustomError(unauthorized.error0, unauthorized.code);
        };
        const result: Boolean = await bcrypt.compare(password,user.password);   
        if(result){
            return jwt.sign({_id: user.id, email: user.email}, secretJWT, {
                expiresIn:  '1h'
            });
        }

        throw new CustomError(unauthorized.error0, unauthorized.code);
    }

    async recoveryPassword(user: Partial<IUser>){

        if(!user.email){
            throw new CustomError(notFound.error0, notFound.code);
        }

        const temporaryPassword = crypto.randomBytes(10).toString('hex');


    }
}

export default new AuthsService;