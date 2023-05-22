import { IUser } from "../models/user.model";
import crypto from 'crypto';
import UsersRepository from "../repositories/users.repository";
import { CustomError } from "../errors/customError.error";
import { unauthorized, notFound, badRequest, authenticationTimeout } from "../errors/errorResponses.error";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import transport from "../models/mailer.model";
import { UpdateWriteOpResult } from "mongoose";

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
            return jwt.sign({_id: user._id, email: user.email}, secretJWT, {
                expiresIn:  '1h'
            });
        }

        throw new CustomError(unauthorized.error0, unauthorized.code);
    }

    async recoveryPassword(user: Partial<IUser>){

        if(!user.email){
            throw new CustomError(badRequest.error4, badRequest.code);
        };

        const registeredUser:IUser | null = await UsersRepository.getByEmail(user.email);
        if(!registeredUser){
            throw new CustomError(notFound.error0, notFound.code);
        }

        const {email, _id} = registeredUser;
        if(!_id){
            throw new CustomError(badRequest.error4, badRequest.code);
        }

        const temporaryPassword = crypto.randomBytes(10).toString('hex');

        const encryptedPassword = await bcrypt.hash(temporaryPassword, 10);

        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 15);

        transport.sendMail({
            from: `Workout Match API <${process.env.EMAIL}>`,
            to: email,
            text: 'Email sent by Workout Match API',
            html: `Temporary password to update your forgotten password: ${temporaryPassword}`
        });

        const result: UpdateWriteOpResult = await UsersRepository.update(
            _id.toString(), {temporaryPassword: encryptedPassword, temporaryPasswordExpiresAt: expirationDate});

        if(result.matchedCount === 0){
            throw new CustomError(notFound.error0, notFound.code); 
        };
        if(result.modifiedCount === 0){
            throw new CustomError(badRequest.error2, badRequest.code);
        };
    }

    async changePassword(user: Partial<IUser>){

        if(!user.email || !user.temporaryPassword || !user.password){
            throw new CustomError(badRequest.error4, badRequest.code);
        };

        const registeredUser:IUser | null = await UsersRepository.getByEmail(user.email);
        if(!registeredUser){
            throw new CustomError(notFound.error0, notFound.code);
        }

        const {temporaryPasswordExpiresAt, temporaryPassword, _id} = registeredUser

        if(!temporaryPasswordExpiresAt || !temporaryPassword || !_id){
            throw new CustomError(badRequest.error4, badRequest.code);
        }

        if(temporaryPasswordExpiresAt <= new Date()){
            throw new CustomError(authenticationTimeout.error0, authenticationTimeout.code); 
        }

        const match: Boolean = await bcrypt.compare(user.temporaryPassword, temporaryPassword);
        
        if(!match){
            throw new CustomError(unauthorized.error0, unauthorized.code);
        }

        const encrypPassword = await bcrypt.hash(user.password, 10);

        const result: UpdateWriteOpResult = await UsersRepository.update(
            _id.toString(), {password: encrypPassword});

        if(result.matchedCount === 0){
            throw new CustomError(notFound.error0, notFound.code); 
        };
        if(result.modifiedCount === 0){
            throw new CustomError(badRequest.error2, badRequest.code);
        };
    }
}

export default new AuthsService;