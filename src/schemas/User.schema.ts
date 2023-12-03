import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces/User.interface';
import { UserType } from '../enums/UserType.enum';

const userSchema: Schema<IUser> = new Schema({
  userId: { type: String, required: true },
  userType: { type: String, required: true, enum: Object.values(UserType) },
  contact: { type: Object, required: true },
  address: { type: Object, required: true },
  incrementingNumber: { type: Number }
});

export const UserModel = mongoose.model<IUser>('User', userSchema, 'users');
