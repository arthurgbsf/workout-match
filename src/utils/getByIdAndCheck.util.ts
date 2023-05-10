
import { CustomError} from "../errors/customError.error";
import { notFound } from "../errors/errorResponses.error";

export const getByIdAndCheck=  async <T>(id: string, repositoryMethod : Function) => {

    const document: (T | null) = await repositoryMethod(id);
    if(!document){
        throw new CustomError(notFound.error0, notFound.code);  
    };
    return document;
         
}




