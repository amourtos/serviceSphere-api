// googleCloudStorage.ts

import { Storage, TransferManager } from '@google-cloud/storage';
import dotenv from 'dotenv';

// Replace with your actual bucket name
const bucketName = 'servicesphere_images';
dotenv.config();
class GoogleCloudStorage {
  private storage: Storage;
  private transferManager: TransferManager;

  constructor() {
    this.storage = new Storage();
    this.transferManager = new TransferManager(this.storage.bucket(bucketName));
  }

  async uploadDirectory(directoryName: string): Promise<void> {
    try {
      await this.transferManager.uploadManyFiles(directoryName);
      console.log(`${directoryName} uploaded to ${bucketName}.`);
    } catch (error) {
      console.error(`Error uploading directory: ${error}`);
      throw error;
    }
  }
}

export default new GoogleCloudStorage();
