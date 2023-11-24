import mongoose, { Schema } from 'mongoose';
import { IUser } from './User.interface';

const userSchema: Schema<IUser> = new Schema({
  userId: { type: String, required: true, unique: true },
  customer: { type: Boolean, required: true },
  contractor: { type: Boolean, required: true },
  contact: { type: Object, required: true },
  address: { type: Object, required: true },
  incrementingNumber: Number
});

export const UserModel = mongoose.model<IUser>('User', userSchema, 'users');
