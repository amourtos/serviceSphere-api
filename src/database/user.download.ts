import { User } from '../models/User.model';
import { logger } from '../config/logger';
import { UserModel } from '../schemas/User.schema';
import { Document } from 'mongoose';
import { IUser } from '../interfaces/User.interface';

export async function getUserById(userId: string): Promise<User | null> {
  let user: User | null = null;
  try {
    const filter = { userId } as { userId: string }; // Add type assertion for filter
    const result = await UserModel.findOne(filter);

    if (!result) {
      logger.warn(`User with userId ${userId} not found.`);
      // Handle the case where the user is not found
      return user;
    }

    logger.info(`User with userId ${userId} has been marked as verified.`);
    user = result as User;
  } catch (error: any) {
    logger.error(`Error retrieving user with userId ${userId}:`, error.message);
    throw new Error('Failed to retrieve user.');
  }
  return user;
}
