import { UserType } from '../enums/UserType.enum';
import { Contact } from './Contact.interface';
import { Address } from './Address.interface';

export interface IUser extends Document {
  userId: string;
  userType: UserType;
  isVerified: boolean;
  contact: Contact;
  address: Address;
  incrementingNumber?: number;
}
