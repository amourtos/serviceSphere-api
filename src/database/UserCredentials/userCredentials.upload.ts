import { logger } from '../../config/logger';
import { UserCredentialsModel } from '../../schemas/UserCredentials.schema';
import { IUserCredentials } from '../../interfaces/UserCredentials.interface';

export async function saveUserCredentials(userCredentials: IUserCredentials): Promise<IUserCredentials> {
  try {
    logger.info(`userId: ${userCredentials.userId} | Saving user creds.`);

    const userCredsInstance = new UserCredentialsModel(userCredentials);
    const savedCreds = await userCredsInstance.save();
    if (!savedCreds) {
      logger.error(`Failed to save user: ${userCredentials.userId}`);
      return savedCreds;
    }
    logger.info(`userId: ${userCredentials.userId} | User Creds saved successfully`);
    return userCredsInstance;
  } catch (error: any) {
    logger.error(`Error saving user: ${error.message}`);
    throw new Error('Failed to save user');
  }
}
