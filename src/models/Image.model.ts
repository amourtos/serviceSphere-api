import { IImage } from '../interfaces/Image.interface';
import { Constants } from '../util/constants';
import { generateId } from '../modules/IdGenerator.module';
import { MongoCollections } from '../enums/MongoCollections.enum';
import { MongoDocumentPrepends } from '../enums/MongoIdPrepends.enum';

export class Image implements IImage {
  imageId: string;
  userId: string;
  boardPostId: string;
  url: string;
  fileName: string;
  createdAt?: Date;

  constructor(imageId: string, userId: string, boardPostId: string, url: string, fileName: string, createdAt?: Date) {
    this.imageId = imageId;
    this.userId = userId;
    this.boardPostId = boardPostId;
    this.url = url;
    this.fileName = fileName;
    this.createdAt = createdAt;
  }

  // Generator method
  public static async generateNewImage(userId: string, boardPostId: string, fileName: string): Promise<Image> {
    // Generate imageId
    const imageId: string = await generateId(MongoDocumentPrepends.IMAGE, MongoCollections.IMAGES);
    // Create and return a new Image instance
    const newFileName = `${imageId}_${fileName}`;
    const url = `https://storage.googleapis.com/servicesphere_images/${newFileName}`;
    return new Image(imageId, userId, boardPostId, url, newFileName, new Date());
  }
}
