import { UserType } from '../enums/UserType.enum';
import { Contact } from './Contact.interface';
import { Address } from './Address.interface';

export interface IUser {
  userId: string;
  userType: UserType;
  isVerified: boolean;
  contact: Contact;
  address: Address;
}
