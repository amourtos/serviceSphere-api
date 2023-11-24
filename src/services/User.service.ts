import { Contact } from '../models/User/Contact/Contact.interface';
import { Address } from '../models/User/Address/Address.interface';
import { User } from '../models/User/User.model';
import { saveNewUser } from '../database/user.upload';

export class UserService {
  public async createUser(customer: boolean, contractor: boolean, contact: Contact, address: Address): Promise<User> {
    // create new user
    const newUser: User = await User.generateNewUser(customer, contractor, contact, address);
    // save new user to DB
    await saveNewUser(newUser);
    // return new user
    return newUser;
  }
}
