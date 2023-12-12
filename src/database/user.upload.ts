import { User } from '../models/User.model';
import { logger } from '../config/logger';
import { UserModel } from '../schemas/User.schema';
import { Document } from 'mongoose';
import { IUser } from '../interfaces/User.interface';

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

export async function markUserAsVerified(userId: string): Promise<void> {
  try {
    const filter = { userId };
    const update = { $set: { isVerified: true } };

    const result = await UserModel.findOneAndUpdate(filter, update, { new: true });

    if (result) {
      logger.info(`User with userId ${userId} has been marked as verified.`);
    } else {
      logger.warn(`User with userId ${userId} not found.`);
      // Handle the case where the user is not found
    }
  } catch (error: any) {
    logger.error(`Error updating user with userId ${userId}:`, error.message);
    throw new Error('Failed to verify user.');
  }
}
