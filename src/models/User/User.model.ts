import { Contact } from './Contact/Contact.interface';
import { Address } from './Address/Address.interface';
import { Constants } from '../../util/constants';
import { generateId } from '../../middleware/generateId.middleware';
import { logger } from '../../config/logger';

export class User {
  userId: string;
  contact: Contact;
  address: Address;
  incrementingNumber?: number;

  constructor(userId: string, contact: Contact, address: Address) {
    this.userId = userId;
    this.contact = contact;
    this.address = address;
  }

  static async generateNewUser(contact: Contact, address: Address): Promise<User> {
    const userId: string = await generateId(Constants.USER_ID);
    logger.info(`userId assigned --> ${userId}`);
    return new User(userId, contact, address);
  }
}
