import mongoose, {ObjectId} from "mongoose";

export async function updateInWorkouts(exercises: Array<mongoose.Types.ObjectId> , workoutId:ObjectId | mongoose.Types.ObjectId , repositoryMethod: Function){

    for( const exerciseId of  exercises){
        await repositoryMethod(exerciseId, workoutId);
    };
    
    return workoutId;
}