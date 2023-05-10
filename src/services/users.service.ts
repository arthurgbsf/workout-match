import { IUser } from "../models/user.model";
import UsersRepository from "../repositories/users.repository";
import { CustomError } from "../errors/customError.error";
import { unauthorized, notFound, conflict, badRequest } from "../errors/errorResponses.error";
import {UpdateWriteOpResult } from "mongoose";
import {DeleteResult} from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getUserTokenId } from "../utils/getUserTokenId.util";
import moment from "moment";
import { getByIdAndCheck } from "../utils/getByIdAndCheck.util";
import { objectIdCheck } from "../utils/objectIdCheck.util";

dotenv.config();

const secretJWT = process.env.JWT_SECRET_KEY || "";

class UsersService{
   
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

    async getUser(headers: string|undefined, user: Boolean, thirdPartyUserId: string | undefined){
        if(thirdPartyUserId){
            objectIdCheck(thirdPartyUserId);
            const thirdPartyUser: IUser = await getByIdAndCheck<IUser>(thirdPartyUserId, UsersRepository.getById);
            return thirdPartyUser;
        }
        const userId:string = getUserTokenId(headers, secretJWT);
        const users: Array<IUser> = await UsersRepository.getAll(userId, user, {myCreatedWorkouts: 1, myCreatedExercises:1, name:1, email:1, _id:1});
        if(users.length === 0){
            throw new CustomError(notFound.error1, notFound.code);
        };
        return users;
    };

    async create(user: IUser){

        const email:IUser | null = await UsersRepository.getByEmail(user.email);
        if(email){
            throw new CustomError(conflict.error1, conflict.code);
        }

        if(user.password) {
            user.password = await bcrypt.hash(user.password, 10);
        }

        const userWithDate: IUser = {...user, createdAt: new Date()}
        return await UsersRepository.create(userWithDate);
    };

    async update(user: Partial<IUser>, headers:string | undefined){
        
        const authUserId: string = getUserTokenId(headers, secretJWT)

        if(user.password) {
            user.password = await bcrypt.hash(user.password, 10);
        }

        if(user.email) {
            console.log(user.email);
            const email:IUser | null = await UsersRepository.getByEmail(user.email);
            
            if(email){
                throw new CustomError(conflict.error1, conflict.code);
            }
        }
        const userWithUpdatedDate: Partial<IUser> = {...user, 
            updatedAt: moment(new Date()).locale("pt-br").format('L [às] LTS ')};

        const result: UpdateWriteOpResult = await UsersRepository.update(authUserId, userWithUpdatedDate);
        if(result.matchedCount === 0){
            throw new CustomError(notFound.error0, notFound.code); 
        };
        if(result.modifiedCount === 0){
            throw new CustomError(badRequest.error2, badRequest.code);
        };
    };

    async remove(headers:string | undefined){

        const authUserId: string = getUserTokenId(headers, secretJWT)
        
        const result : DeleteResult = await UsersRepository.remove(authUserId);
        if(result.deletedCount === 0){
            throw new CustomError(badRequest.error3, badRequest.code);
        }; 
    };
};

export default new UsersService;