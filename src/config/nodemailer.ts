import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { logger } from './logger';

const userName = process.env.NODEMAILER_ADDRESS;
const pass = process.env.NODEMAILER_APP_PASS;

dotenv.config();
const nodeMailerTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: userName,
    pass: pass
  }
});

logger.info(`Nodemailer Logged in with email: ${userName}`);

export default nodeMailerTransporter;

export function emailGreeting(firstName: string, lastName: string, verificationCode: string): string {
  return `
  Thank you ${firstName} ${lastName} for signing up for ServiceSphere. 
  Your User verification Code is ${verificationCode}`;
}
