import { IUserCredentials } from '../../interfaces/UserCredentials.interface';
import mongoose, { Schema } from 'mongoose';

const userCredentialsSchema: Schema<IUserCredentials> = new Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

export const UserCredentialsModel = mongoose.model('UserCredentials', userCredentialsSchema, 'user_credentials');
