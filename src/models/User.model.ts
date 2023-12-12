import { Contact } from '../interfaces/Contact.interface';
import { Address } from '../interfaces/Address.interface';
import { UserType } from '../enums/UserType.enum';
import { logger } from '../config/logger';
import { generateUserId } from '../middleware/generateUserId.middleware';
import { generateVerificationCode } from '../middleware/generateVerificationCode.middleware';
import { saveVerificationCode } from '../database/verificationCode.upload';
import { EmailOptions } from '../interfaces/EmailOptions.interface';
import { sendEmail } from '../middleware/nodemailer.middleware';

export class User {
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
    const userId = await generateUserId(userType);
    // generate code for user verification
    const verificationCode = generateVerificationCode();
    logger.info(`Generated verificationCode --> ${verificationCode}`);
    // send email with verificaiton code and welcome message
    const emailOptions: EmailOptions = {
      to: contact.email,
      subject: `ServiceSphere Verification Code`,
      text: `User verification Code is ${verificationCode}`
    };
    await sendEmail(emailOptions);
    await saveVerificationCode(userId, verificationCode);

    return new User(userId, userType, contact, address);
  }
}
