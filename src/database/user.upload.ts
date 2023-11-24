import { User } from '../models/User/User.model';
import { logger } from '../config/logger';
import { UserModel } from '../models/User/User.schema';
import { Document } from 'mongoose';
import { IUser } from '../models/User/User.interface';

export async function saveNewUser(user: User): Promise<IUser> {
  try {
    logger.info(`userId: ${user.userId} | Saving new user to collection`);

    const userInstance = new UserModel(user);
    const savedUser = await userInstance.save();

    logger.info(`userId: ${user.userId} | User saved successfully`);
    return savedUser;
  } catch (error: any) {
    logger.error(`Error saving user: ${error.message}`);
    throw new Error('Failed to save user');
  }
}
