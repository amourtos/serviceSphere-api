import { EmailOptions } from '../interfaces/EmailOptions.interface';
import nodeMailerTransporter from '../config/nodemailer';
import nodemailer from 'nodemailer';
import { logger } from '../config/logger';
import dotenv from 'dotenv';

dotenv.config();
export async function sendEmail(options: EmailOptions): Promise<void> {
  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.NODEMAILER_ADDRESS,
    to: options.to,
    subject: options.subject,
    text: options.text
  };

  try {
    const info = await nodeMailerTransporter.sendMail(mailOptions);
    logger.info('Email sent:', info.response);
  } catch (error: any) {
    logger.error('Error sending email:', error.message);
    throw new Error('Failed to send email');
  }
}
