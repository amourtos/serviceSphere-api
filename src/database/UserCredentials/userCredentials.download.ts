import { logger } from '../../config/logger';
import { UserCredentialsModel } from '../../schemas/UserCredentials.schema';
import { IUserCredentials } from '../../interfaces/UserCredentials.interface';

/**
 * Get a user by userId and email. If there is no user, function will return null
 * @param userId
 * @param email
 */
export async function getUserCredsByIdAndEmail(userId: string, email: string): Promise<IUserCredentials | null> {
  try {
    logger.info(`userId: ${userId} | Getting user creds.`);
    const query = { userId: userId, email: email };
    const userCreds = await UserCredentialsModel.findOne(query);

    if (!userCreds) {
      logger.info(`No credentials found for user: ${userId}`);
      return userCreds;
    }
    logger.info(`userId: ${userId} | User credentials retrieved`);
    return userCreds;
  } catch (error: any) {
    logger.error(`Error saving user: ${error.message}`);
    throw new Error('Failed to save user');
  }
}

export async function findUserByEmail(email: string): Promise<IUserCredentials | null> {
  try {
    logger.info(`email: ${email} | Getting user creds.`);
    const query = { email: email };
    const userCreds = await UserCredentialsModel.findOne(query);

    if (!userCreds) {
      logger.info(`No credentials found for user: ${email}`);
      return userCreds;
    }
    logger.info(`userId: ${email} | User credentials retrieved`);
    return userCreds;
  } catch (error: any) {
    logger.error(`Error saving user: ${error.message}`);
    throw new Error('Failed to save user');
  }
}
