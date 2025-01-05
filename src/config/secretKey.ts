import crypto from 'crypto';
import { logger } from './logger';
import dotenv from 'dotenv';

dotenv.config();
let secretKey: string = generateSecretKey();

function generateSecretKey() {
  const keyLength = 32;
  // non-local testing environment should have encrypted key
  if (process.env.NODE_ENV != 'DEV') {
    return crypto.randomBytes(keyLength).toString('hex');
  }
  return process.env.LOCAL_SECRET_KEY || 'TEST';
}

const keyRegenInterval = 3600000;
setInterval(() => {
  secretKey = generateSecretKey();
  logger.info(`Regenerated Secret Key: ${secretKey}`);
}, keyRegenInterval);

export { secretKey };
