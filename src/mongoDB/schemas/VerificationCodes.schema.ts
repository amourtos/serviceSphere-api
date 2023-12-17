import { IVerificationCodes } from '../../interfaces/VerificationCodes.interface';
import mongoose, { Schema } from 'mongoose';

const verificationCodesSchema: Schema<IVerificationCodes> = new Schema({
  verificationCode: { type: String, required: true },
  userId: { type: String, ref: 'User', required: true }
});

export const VerificationCodeModel = mongoose.model<IVerificationCodes>(
  'VerificationCode',
  verificationCodesSchema,
  'verification_codes'
);
