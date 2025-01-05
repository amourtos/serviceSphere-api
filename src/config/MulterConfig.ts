import multer, { FileFilterCallback } from 'multer';

class MulterConfig {
  private storage: multer.StorageEngine;
  private limits: multer.Options['limits'];
  private fileFilter: multer.Options['fileFilter'];

  constructor() {
    // Configure storage (choose one)
    this.storage = multer.memoryStorage();
    // this.storage = multer.diskStorage({ ... }); // If you want disk storage

    this.limits = {
      fileSize: 1024 * 1024 * 5 // 5MB
    };

    this.fileFilter = (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    };
  }

  getMulterInstance(): multer.Multer {
    return multer({
      storage: this.storage,
      limits: this.limits,
      fileFilter: this.fileFilter
    });
  }
}

export default new MulterConfig();
