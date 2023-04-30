import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();
mongoose.set('strictQuery', false);

const databaseUrl = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/workoutMatch';

export default mongoose.connect(databaseUrl);