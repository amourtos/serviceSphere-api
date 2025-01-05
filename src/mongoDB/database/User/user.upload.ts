import { User } from '../../../models/User.model';
import { logger } from '../../../config/logger';
import { UserModel } from '../../schemas/User.schema';
import { IUser } from '../../../interfaces/User.interface';
import { Contact } from '../../../interfaces/Contact.interface';
import { Address } from '../../../interfaces/Address.interface';
import { Constants } from '../../../util/constants';

export async function saveNewUser(user: User): Promise<IUser> {
  try {
    logger.info(`userId: ${user.userId} | Saving new user to collection`);

    const userInstance = new UserModel(user);
    const savedUser = await userInstance.save();

    logger.info(`userId: ${user.userId} | User saved successfully`);
    return savedUser;
  } catch (error: any) {
    logger.error(`Error saving user: ${error.message}`);
    throw new Error('Failed to save user');
  }
}

export async function markUserAsVerified(userId: string): Promise<void> {
  try {
    const filter = { userId };
    const update = { $set: { isVerified: true } };

    const result = await UserModel.findOneAndUpdate(filter, update, { new: true });

    if (result) {
      logger.info(`User with userId ${userId} has been marked as verified.`);
    } else {
      logger.warn(`User with userId ${userId} not found.`);
      // Handle the case where the user is not found
    }
  } catch (error: any) {
    logger.error(`Error updating user with userId ${userId}:`, error.message);
    throw new Error('Failed to verify user.');
  }
}

export async function updateContact(contact: Contact, userId: string): Promise<User | null> {
  try {
    const filter = { userId };
    const update = { $set: { contact: contact } };
    const result = await UserModel.findOneAndUpdate(filter, update);

    if (!result) {
      logger.warn(`User with userId ${userId} not found.`);
      // Handle the case where the user is not found
      return null;
    }
    logger.info(`User with userId ${userId} has updated contact information successfully.`);
    return result;
  } catch (error: any) {
    logger.error(`Error updating user with userId ${userId}:`, error.message);
    throw new Error('Failed to update user.');
  }
}

export async function updateAddress(address: Address, userId: string): Promise<User | null> {
  try {
    const filter: { userId: string } = { userId };
    const update = { $set: { address: address } };
    const result: User = (await UserModel.findOneAndUpdate(filter, update)) as User;

    if (!result) {
      logger.warn(`User with userId ${userId} not found.`);
      // Handle the case where the user is not found
      return null;
    }
    logger.info(`User with userId ${userId} has updated address information successfully.`);
    return result;
  } catch (error: any) {
    logger.error(`Error updating user with userId ${userId}:`, error.message);
    throw new Error('Failed to verify user.');
  }
}

export async function deleteUserById(userId: string): Promise<string> {
  try {
    const query = { userId: userId };
    const responseUpdate = await UserModel.findOneAndDelete(query);
    if (!responseUpdate) {
      logger.error(`Deleting user: ${userId} FAILED`);
      return Constants.FAILED;
    }
  } catch (error) {
    logger.error(error);
    throw new Error('Failed to delete user');
  }
  return Constants.SUCCESS;
}
