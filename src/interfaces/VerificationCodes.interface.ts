import { Schema } from 'mongoose';

export interface IVerificationCodes {
  verificationCode: string;
  userId: string;
}
