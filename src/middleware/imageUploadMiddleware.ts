import { RequestHandler } from 'express';
import MulterConfig from '../config/MulterConfig';

const upload = MulterConfig.getMulterInstance();

export const imageUpload: RequestHandler = upload.array('images', 10);
