import { model, Schema } from 'mongoose';
import { IImage } from '../../interfaces/Image.interface';

const imageSchema: Schema<IImage> = new Schema(
  {
    imageId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, ref: 'User' },
    boardPostId: { type: String, required: true, ref: 'BoardPost' },
    url: { type: String, required: true },
    fileName: { type: String, required: true }
  },
  { timestamps: true }
);

export const ImageModel = model('Image', imageSchema);
