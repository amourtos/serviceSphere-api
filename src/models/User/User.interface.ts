import { Document } from 'mongoose';
import { Contact } from './Contact/Contact.interface';
import { Address } from './Address/Address.interface';

export interface IUser extends Document {
  userId: string;
  contact: Contact;
  address: Address;
  incrementingNumber: number;
}
