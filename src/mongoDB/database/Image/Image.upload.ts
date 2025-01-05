import { Image } from '../../../models/Image.model';
import { IImage } from '../../../interfaces/Image.interface';
import { logger } from '../../../config/logger';
import { ImageModel } from '../../schemas/Image.schema';

export async function saveNewImage(image: Image): Promise<IImage> {
  try {
    logger.info(`imageId: ${image.imageId} | Saving new Image to images collection`);
    const imageInstance = new ImageModel(image);
    const savedImage = await imageInstance.save();
    logger.info(`imageId: ${image.imageId} | Image saved successfully`);
    return savedImage;
  } catch (error: any) {
    logger.error(`Error saving image: ${error.message}`);
    throw new Error(`Failed to save image: ${error.message}`);
  }
}
