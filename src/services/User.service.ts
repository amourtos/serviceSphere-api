import { Contact } from '../interfaces/Contact.interface';
import { Address } from '../interfaces/Address.interface';
import { User } from '../models/User.model';
import { saveNewUser } from '../database/user.upload';
import { UserType } from '../enums/UserType.enum';

export class UserService {
  public async createUser(userType: UserType, contact: Contact, address: Address): Promise<User> {
    // create new user
    const newUser: User = await User.generateNewUser(userType, contact, address);
    // save new user to DB
    await saveNewUser(newUser);
    // return new user
    return newUser;
  }
}
