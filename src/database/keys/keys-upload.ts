import { generateEncryptionKey } from '../../middleware/crypto.middleware';
import mongoose from 'mongoose';
import { logger } from '../../config/logger';

export async function uploadKey(globalId: string): Promise<boolean> {
  try {
    const encryptionKey = generateEncryptionKey();
    const keysCollection = mongoose.connection.collection('keys');
    const document = { globalId: globalId, encryptionKey: encryptionKey };

    return keysCollection
      .insertOne(document)
      .then(() => {
        logger.info(`globalId: ${globalId} | Encryption key created and stored.`);
        return true;
      })
      .catch((error: any) => {
        logger.error(`globalId: ${globalId} | Error creating encryption key:`, error);
        throw error;
      });
  } catch (error: any) {
    logger.error(`globalId: ${globalId} | Error creating encryption key:`, error);
    throw error;
  }
}

export async function deleteKey(globalId: string): Promise<void> {
  logger.info('Deleting encryption key.');
  try {
    const keysCollection = mongoose.connection.collection('keys');
    await keysCollection.deleteOne({ globalId: globalId });
  } catch (error) {
    console.error(error);
  }
}
