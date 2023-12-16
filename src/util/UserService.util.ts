import { logger } from '../config/logger';
import { findUserByEmail } from '../database/UserCredentials/userCredentials.download';
import { IUserCredentials } from '../interfaces/UserCredentials.interface';
import jwt from 'jsonwebtoken';
import { secretKey } from '../config/secretKey';
import dotenv from 'dotenv';
import { serialize } from 'cookie';
/**
 * This class will hold all utilitous functions used by UserService class
 */
dotenv.config();
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

    const token: string = jwt.sign(payload, secretKey, options);
    const oneHour: number = 60 * 60 * 1000;
    const cookieOptions = {
      httpOnly: true,
      path: '/',
      maxAge: oneHour, // 1h in milliseconds
      expires: new Date(Date.now() + oneHour),
      sameSite: process.env.cookie_samesite as 'strict' | 'lax' | 'none' | undefined,
      domain: process.env.cookie_domain_dev, // your domain
      secure: process.env.NODE_ENV === 'production' // true if using HTTPS, false for development
    };

    return serialize('token', token, cookieOptions);
  }
}
