import { Contact } from '../interfaces/Contact.interface';
import { Address } from '../interfaces/Address.interface';
import { UserType } from '../enums/UserType.enum';
import { logger } from '../config/logger';
import { generateUserId } from '../middleware/generateUserId.middleware';

export class User {
  userId: string;
  userType: UserType;
  contact: Contact;
  address: Address;

  constructor(userId: string, userType: UserType, contact: Contact, address: Address) {
    this.userId = userId;
    this.userType = userType;
    this.contact = contact;
    this.address = address;
  }

  public static async generateNewUser(userType: UserType, contact: Contact, address: Address): Promise<User> {
    logger.info(`Generating new User with userType: ${userType}`);
    const userId = await generateUserId(userType);
    return new User(userId, userType, contact, address);
  }
}
