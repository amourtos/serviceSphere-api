import crypto from 'crypto';
import { logger } from './logger';

let secretKey: string = generateSecretKey();

function generateSecretKey() {
  const keyLength = 32;
  return crypto.randomBytes(keyLength).toString('hex');
}

const keyRegenInterval = 3600000;
setInterval(() => {
  secretKey = generateSecretKey();
  logger.info(`Regenerated Secret Key: ${secretKey}`);
}, keyRegenInterval);

export { secretKey };
