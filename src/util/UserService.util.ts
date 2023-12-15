import { logger } from '../config/logger';
import { findUserByEmail } from '../database/UserCredentials/userCredentials.download';
import { IUserCredentials } from '../interfaces/UserCredentials.interface';
import jwt from 'jsonwebtoken';
import { secretKey } from '../config/secretKey';
/**
 * This class will hold all utilitous functions used by UserService class
 */
export class UserServiceUtil {
  public async isUserDuplicate(email: string): Promise<boolean> {
    logger.info(`Checking for duplicate user: ${email} --- START`);
    const userCreds: IUserCredentials | null = await findUserByEmail(email);
    if (userCreds) {
      logger.info(`Checking for duplicate user: ${email} --- USER FOUND`);
      return true;
    }
    logger.info(`Checking for duplicate user: ${email} --- USER NOT FOUND`);
    return false;
  }

  public generateAccessToken(userId: string): string {
    const payload = {
      userId
    };
    const options: jwt.SignOptions = {
      expiresIn: '1h'
    };
    return jwt.sign(payload, secretKey, options);
  }
}
