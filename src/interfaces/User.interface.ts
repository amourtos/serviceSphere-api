import { Document } from 'mongoose';
import { Contact } from './Contact.interface';
import { Address } from './Address.interface';
import { UserType } from '../enums/UserType.enum';

export interface IUser extends Document {
  userId: string;
  userType: UserType;
  contact: Contact;
  address: Address;
  incrementingNumber?: number;
}
