import { VerificationCodeModel } from '../../schemas/VerificationCodes.schema';
import { logger } from '../../../config/logger';

export async function validateVerificationCode(userId: string, verificationCode: string): Promise<boolean> {
  try {
    // Find the verification code document for the given userId
    const verificationCodeDoc = await VerificationCodeModel.findOne({ userId });

    if (verificationCodeDoc) {
      // Compare the submitted code with the stored code
      const storedCode = verificationCodeDoc.verificationCode;
      const isValid = verificationCode === storedCode;

      if (isValid) {
        logger.info('Verification code is valid.');
        return true;
      } else {
        logger.warn('Verification code is invalid.');
        return false;
      }
    }
    logger.warn(`No verification code found for user with userId ${userId}.`);
    return false;
  } catch (error: any) {
    logger.error(`Error validating verification code for user with userId ${userId}:`, error);
    throw new Error('Failed to verify user.');
  }
}
