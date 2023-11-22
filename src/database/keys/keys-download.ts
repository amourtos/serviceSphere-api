import mongoose from 'mongoose';
import { logger } from '../../config/logger';

export async function getKeyByGlobalId(globalId: string): Promise<string> {
  try {
    const keysCollection = mongoose.connection.collection('keys');
    const document = await keysCollection.findOne({ globalId });
    if (document) {
      logger.info(`globalId: ${globalId} | Document retrieved.`);
      return document.encryptionKey;
    }
    logger.info(`globalId: ${globalId} | Document not found.`);
    return '';
  } catch (error) {
    logger.error(`globalId: ${globalId} | Error retrieving document:`, error);
    throw error;
  }
}
