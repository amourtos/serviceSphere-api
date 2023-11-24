import { User } from '../User.model';
import { Contact } from '../Contact/Contact.interface';
import { Address } from '../Address/Address.interface';

export class Contractor extends User {
  contractorId: string;

  constructor(
    userId: string,
    customer: boolean,
    contractor: boolean,
    contact: Contact,
    address: Address,
    contractorId: string,
    incrementingNumber?: number
  ) {
    super(userId, contact, address);
    this.contractorId = contractorId;
  }
}
