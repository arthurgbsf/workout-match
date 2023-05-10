
import { CustomError} from "../errors/customError.error";

export const getByIdAndCheck=  async <T>(id: string, repositoryMethod : Function) => {

    const document: (T | null) = await repositoryMethod(id);
    if(!document){
        throw new CustomError('Document not found.', 404);  
    };
    return document;
         
}




