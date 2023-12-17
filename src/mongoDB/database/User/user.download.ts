import { User } from '../../../models/User.model';
import { logger } from '../../../config/logger';
import { UserModel } from '../../schemas/User.schema';
import { UserType } from '../../../enums/UserType.enum';
import mongoose, { AnyObject } from 'mongoose';

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

export async function getUserByEmail(email: string): Promise<User | null> {
  logger.info(`Retrieving user by email:${email}`);
  const user: User | null = null;
  try {
    const filter = { email: email };
    const result = await UserModel.findOne(filter);
    if (result) {
      logger.info('User found.');
      return result as User;
    }
  } catch (error: any) {
    logger.error(`Error retrieving user with email ${email}:`, error.message);
    throw new Error('Failed to retrieve user.');
  }
  logger.warn(`No user found with email:${email}`);
  return user;
}

// export async function getAllUsersByUserType(userType: UserType): Promise<Document[]> {
//   const collection = mongoose.connection.collection('users');
//   const filter = { userType: userType };
//   // Find the document with the largest globalId for the given sourceId
//   return await collection.find({ userType: userType });
// }
