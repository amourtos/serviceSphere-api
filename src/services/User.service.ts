import { Contact } from '../interfaces/Contact.interface';
import { Address } from '../interfaces/Address.interface';
import { User } from '../models/User.model';
import { markUserAsVerified, saveNewUser, updateAddress, updateContact } from '../database/User/user.upload';
import { UserType } from '../enums/UserType.enum';
import { validateVerificationCode } from '../database/VerificationCode/verificationCode.download';
import { logger } from '../config/logger';
import { getUserById } from '../database/User/user.download';
import { IUserCredentials } from '../interfaces/UserCredentials.interface';
import { saveUserCredentials } from '../database/UserCredentials/userCredentials.upload';
import bcrypt from 'bcryptjs';
import { UserServiceUtil } from '../util/UserService.util';
import { IUser } from '../interfaces/User.interface';
import { generateVerificationCode } from '../middleware/generateVerificationCode.middleware';
import { EmailOptions } from '../interfaces/EmailOptions.interface';
import { emailGreeting } from '../config/nodemailer';
import { sendEmail } from '../middleware/nodemailer.middleware';
import { saveVerificationCode } from '../database/VerificationCode/verificationCode.upload';

export class UserService {
  protected userServiceUtil: UserServiceUtil = new UserServiceUtil();

  /**
   * Create new User
   * <p>Step 1: generate new user object </p>
   * <p>Step 2: check for duplicate user </p>
   * <p>Step 4: generate and save user creds </p>
   * <p>Step 5: save newUser </p>
   * <p>Step 6: send email verification to user </p>
   * @param userType
   * @param password
   * @param password
   * @param contact
   * @param address
   */
  public async createUser(userType: UserType, password: string, contact: Contact, address: Address): Promise<User> {
    // 1. generate new User
    const newUser: User = await User.generateNewUser(userType, contact, address);
    const userCreds: IUserCredentials = {
      userId: newUser.userId,
      email: contact.email,
      password: await bcrypt.hash(password, 10)
    };

    // 2. check if user is duplicate
    if (await this.userServiceUtil.isUserDuplicate(userCreds.email)) {
      throw new Error(`Duplicate Email detected: ${userCreds.email}`);
    }

    // 3. save credentials
    const savedCreds: IUserCredentials = await saveUserCredentials(userCreds);
    if (!savedCreds) throw new Error("Error saving user's credentials");

    // 4. save new user
    const savedUser: IUser = await saveNewUser(newUser);
    if (!savedUser) throw new Error(`Error saving new User to DB: ${newUser.userId}`);

    // 5. generate code for user verification
    const verificationCode: string = generateVerificationCode();
    logger.info(`Generated verificationCode --> ${verificationCode}`);
    await saveVerificationCode(newUser.userId, verificationCode);

    // 6. send email with verificaiton code and welcome message
    const emailOptions: EmailOptions = {
      to: contact.email,
      subject: `ServiceSphere Verification Code`,
      text: emailGreeting(contact.firstName, contact.lastName, verificationCode)
    };
    await sendEmail(emailOptions);

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

  /**
   * Delete user by userId
   * @param userId
   */
  public async deleteUser(userId: string): Promise<string> {
    const message = '';
    logger.info(`Deleting user: ${userId} --- START`);
    logger.info(`Deleting user: ${userId} --- COMPLETE`);
    logger.info(`Deleting user: ${userId} --- ERROR`);
    return message;
  }
}
