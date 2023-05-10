import { CustomError } from "../errors/customError.error";
import { unauthorized } from "../errors/errorResponses.error";

export function getToken(token:(string | undefined)) :string {
    if(!token){
        throw new CustomError(unauthorized.error0, unauthorized.code);
    }
    const splitedToken = token.split('Bearer ');
    const code = splitedToken[1];
    return code;
}