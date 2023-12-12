import { Contact } from '../interfaces/Contact.interface';
import { Address } from '../interfaces/Address.interface';
import { User } from '../models/User.model';
import { markUserAsVerified, saveNewUser } from '../database/user.upload';
import { UserType } from '../enums/UserType.enum';
import { validateVerificationCode } from '../database/verificationCode.download';

export class UserService {
  public async createUser(userType: UserType, contact: Contact, address: Address): Promise<User> {
    // create new user
    const newUser: User = await User.generateNewUser(userType, contact, address);
    // save new user to DB
    await saveNewUser(newUser);
    // return new user
    return newUser;
  }

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
}
