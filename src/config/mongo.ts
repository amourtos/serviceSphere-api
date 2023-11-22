import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ILogObj, Logger } from 'tslog';

dotenv.config();
const log: Logger<ILogObj> = new Logger();
const mongoDbUri = process.env.MONGO_DB_URI ?? 'no uri provided';

const connectDb = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoDbUri, {
      dbName: 'Atlas-payfac'
    });
    log.info('MongoDB connected');
  } catch (error) {
    log.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDb;
