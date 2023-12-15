import { Contact } from '../interfaces/Contact.interface';
import { Address } from '../interfaces/Address.interface';
import { User } from '../models/User.model';
import {
  deleteUserById,
  markUserAsVerified,
  saveNewUser,
  updateAddress,
  updateContact
} from '../database/User/user.upload';
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
import { Constants } from '../util/constants';
import { IServiceResponse } from '../interfaces/ServiceResponse.interface';
import { ServiceUtil } from '../util/Service.util';
import { ServiceStatusEnum } from '../enums/ServiceStatus.enum';
import { authenticateUser } from '../database/UserCredentials/userCredentials.download';

export class UserService {
  protected userServiceUtil: UserServiceUtil = new UserServiceUtil();
  message = '';
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
  public async createUser(
    userType: UserType,
    password: string,
    contact: Contact,
    address: Address
  ): Promise<IServiceResponse> {
    // 1. generate new User
    const newUser: User = await User.generateNewUser(userType, contact, address);
    const userCreds: IUserCredentials = {
      userId: newUser.userId,
      email: contact.email,
      password: await bcrypt.hash(password, 10)
    };

    // 2. check if user is duplicate
    if (await this.userServiceUtil.isUserDuplicate(userCreds.email)) {
      this.message = `Duplicate Email detected: ${userCreds.email}`;
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_FAILURE, this.message, { newUser });
    }

    // 3. save credentials
    const savedCreds: IUserCredentials = await saveUserCredentials(userCreds);
    if (!savedCreds) {
      this.message = "Error saving user's credentials";
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_FAILURE, this.message, { newUser });
      // throw new Error("Error saving user's credentials");
    }

    // 4. save new user
    const savedUser: IUser = await saveNewUser(newUser);
    if (!savedUser) {
      // throw new Error(`Error saving new User to DB: ${newUser.userId}`);
      this.message = `Error saving new User to DB: ${newUser.userId}`;
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_FAILURE, this.message, { newUser });
    }

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
    this.message = 'User created successfully. Email verification sent.';
    return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, { newUser });
  }

  /**
   * Verify the submitted verification string and update the user in 'users' collection
   * @param userId
   * @param verificationCode
   */
  public async verifyAndUpdateUser(userId: string, verificationCode: string): Promise<IServiceResponse> {
    logger.info(`Verifying user:${userId} --- START`);
    const isVerificationCodeValid: boolean = await validateVerificationCode(userId, verificationCode);
    // update user doc to set flag as true
    if (isVerificationCodeValid) {
      await markUserAsVerified(userId);
      logger.info(`Verifying user:${userId} --- SUCCESS`);
      this.message = `verificationCode is valid for user: ${userId}`;
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, {});
    }
    // if verificationCode is invalid
    logger.info(`Verifying user:${userId} --- FAILED`);
    this.message = `userId: ${userId} | VerificationCode is invalid.`;
    return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_FAILURE, this.message, {});
  }

  /**
   * Retrieve User by userId property. If no user is found, return data as null
   * @param userId
   */
  public async retrieveUser(userId: string): Promise<IServiceResponse> {
    logger.info(`Retrieving user: ${userId} --- START`);
    // retrieve user from DB
    const user: User | null = await getUserById(userId);
    if (!user) {
      this.message = `User not found with id:${userId}`;
      logger.warn(this.message);
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_FAILURE, this.message, { user });
    }
    logger.info(`Retrieving user: ${userId} --- COMPLETE`);
    this.message = `User: ${userId} successfully retrieved.`;
    return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, { user });
  }

  public async updateUserContact(userId: string, contact: Contact): Promise<IServiceResponse> {
    logger.info(`Updating user: ${userId} contact information --- START`);
    const updatedUser: User | null = await updateContact(contact, userId);
    if (!updatedUser) {
      this.message = `User not found with id:${userId}`;
      logger.warn(this.message);
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_FAILURE, this.message, { updatedUser });
    }
    logger.info(`Updating user: ${userId} contact information --- COMPLETE`);
    this.message = `User: ${userId} successfully updated contact information.`;
    return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, { updatedUser });
  }

  public async updateUserAddress(userId: string, address: Address): Promise<IServiceResponse> {
    logger.info(`Updating user: ${userId} address information --- START`);
    const updatedUser: User | null = await updateAddress(address, userId);
    if (!updatedUser) {
      this.message = `User not found with id:${userId}`;
      logger.warn(this.message);
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_FAILURE, this.message, { updatedUser });
    }
    logger.info(`Updating user: ${userId} address information --- COMPLETE`);
    this.message = `User: ${userId} successfully updated address information.`;
    return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, { updatedUser });
  }

  /**
   * Delete user by userId
   * @param userId
   */
  public async deleteUser(userId: string): Promise<IServiceResponse> {
    logger.info(`Deleting user: ${userId} --- START`);
    try {
      this.message = await deleteUserById(userId);
      if (this.message === Constants.FAILED) {
        this.message = `User deletion failed for user: ${userId}`;
        logger.error(this.message);
        return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_FAILURE, this.message, {});
      }
    } catch {
      logger.info(`Deleting user: ${userId} --- ERROR`);
      throw new Error(`Deleting user: ${userId} --- ERROR`);
    }
    logger.info(`Deleting user: ${userId} --- COMPLETE`);
    return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_FAILURE, this.message, {});
  }

  public async loginUser(email: string, password: string, userId: string): Promise<IServiceResponse> {
    logger.info(`Logging in user: ${userId} --- START`);
    try {
      const isAuthenticated: boolean = await authenticateUser(email, password);

      if (isAuthenticated) {
        this.message = 'Authentication successful.';
        logger.info(this.message);
        const accessToken: string = this.userServiceUtil.generateAccessToken(userId);
        // generate a session and manage here

        return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, {
          accessToken: accessToken
        });
      }
    } catch (error: any) {
      this.message = `Error: ${error.message}`;
      logger.error(this.message);
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_FAILURE, this.message, {});
    }
    this.message = `Logging in user:${userId} failed.`;
    return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_FAILURE, this.message, {});
  }
}
