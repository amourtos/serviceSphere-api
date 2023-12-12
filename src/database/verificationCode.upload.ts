import { logger } from '../config/logger';
import { VerificationCodeModel } from '../schemas/VerificationCodes.schema';

export async function saveVerificationCode(userId: string, verificationCode: string): Promise<void> {
  logger.info(`userId: ${userId} | Saving new verificationCode to collection.`);

  try {
    // check if verificaiton Code already exists for user
    const existingVerificationCode = await VerificationCodeModel.findOne({ userId });
    if (existingVerificationCode) {
      logger.info('Overwriting existing verificationCode');
      existingVerificationCode.verificationCode = verificationCode;
      await existingVerificationCode.save();
    }
    // no verificationCode exists, creating new document
    logger.info('no verificationCode exists, creating new document');
    await VerificationCodeModel.create({ verificationCode, userId });
  } catch (error: any) {
    logger.error(`Error saving verificationCode: ${error.message}`);
    throw new Error('Failed to save verificationCode');
  }
}
