import { Contact } from '../interfaces/Contact.interface';
import { Address } from '../interfaces/Address.interface';
import { User } from '../models/User.model';
import { markUserAsVerified, saveNewUser, updateAddress, updateContact } from '../database/user.upload';
import { UserType } from '../enums/UserType.enum';
import { validateVerificationCode } from '../database/verificationCode.download';
import { logger } from '../config/logger';
import { getUserById } from '../database/user.download';

export class UserService {
  /**
   * Create new User
   * @param userType
   * @param contact
   * @param address
   */
  public async createUser(userType: UserType, contact: Contact, address: Address): Promise<User> {
    // create new user
    const newUser: User = await User.generateNewUser(userType, contact, address);
    // save new user to DB
    await saveNewUser(newUser);
    // return new user
    return newUser;
  }

  /**
   * Verify the submitted verification string and update the user in 'users' collection
   * @param userId
   * @param verificationCode
   */
  public async verifyAndUpdateUser(userId: string, verificationCode: string): Promise<any> {
    let response: object = {};
    const isVerificationCodeValid = await validateVerificationCode(userId, verificationCode);
    // update user doc to set flag as true
    if (isVerificationCodeValid) {
      await markUserAsVerified(userId);
      response = {
        message: `userId: ${userId} | user verified successfully`,
        isVerified: true
      };
      return response;
    }
    // if verificationCode is invalid
    response = {
      message: `userId: ${userId} | VerificationCode is invalid.`,
      isVerified: false
    };
    return response;
  }

  public async retrieveUser(userId: string): Promise<User | null> {
    logger.info(`Retrieving user: ${userId} --- START`);
    let userResponse: User | null = null;
    // retrieve user from DB
    userResponse = await getUserById(userId);
    if (!userResponse) {
      logger.warn(`User not found with id:${userId}`);
      return userResponse;
    }
    logger.info(`Retrieving user: ${userId} --- COMPLETE`);
    return userResponse;
  }

  public async updateUserContact(userId: string, contact: Contact): Promise<User | null> {
    logger.info(`Updating user: ${userId} contact information --- START`);
    const updatedUser: User | null = await updateContact(contact, userId);
    if (!updatedUser) {
      logger.warn(`User not found with id:${userId}`);
      return updatedUser;
    }
    logger.info(`Updating user: ${userId} contact information --- COMPLETE`);
    return updatedUser;
  }

  public async updateUserAddress(userId: string, address: Address): Promise<User | null> {
    logger.info(`Updating user: ${userId} contact information --- START`);
    const updatedUser: User | null = await updateAddress(address, userId);
    if (!updatedUser) {
      logger.warn(`User not found with id:${userId}`);
      return updatedUser;
    }
    logger.info(`Updating user: ${userId} contact information --- COMPLETE`);
    return updatedUser;
  }
}
