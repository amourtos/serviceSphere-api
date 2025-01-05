import { Contact } from '../interfaces/Contact.interface';
import { Address } from '../interfaces/Address.interface';
import { UserType } from '../enums/UserType.enum';
import { logger } from '../config/logger';
import { generateId } from '../modules/IdGenerator.module';
import { IUser } from '../interfaces/User.interface';
import { MongoCollections } from '../enums/MongoCollections.enum';
import { MongoDocumentPrepends } from '../enums/MongoIdPrepends.enum';

export class User implements IUser {
  userId: string;
  userType: UserType;
  isVerified: boolean;
  contact: Contact;
  address: Address;

  constructor(userId: string, userType: UserType, contact: Contact, address: Address) {
    this.userId = userId;
    this.userType = userType;
    this.isVerified = false;
    this.contact = contact;
    this.address = address;
  }

  public static async generateNewUser(userType: UserType, contact: Contact, address: Address): Promise<User> {
    // generate new userId
    logger.info(`Generating new User with userType: ${userType}`);
    const userId = await generateId(
      userType == UserType.CONTRACTOR ? MongoDocumentPrepends.CONTRACTOR : MongoDocumentPrepends.CUSTOMER,
      MongoCollections.USERS
    );

    return new User(userId, userType, contact, address);
  }
}
