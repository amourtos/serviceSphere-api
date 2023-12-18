import { BoardPost } from '../../../models/BoardPost.model';
import { logger } from '../../../config/logger';
import { BoardPostModel } from '../../schemas/BoardPost.schema';

export async function getAllPosts(): Promise<BoardPost[]> {
  let posts: BoardPost[];
  logger.info('Getting all board posts');
  try {
    posts = await BoardPostModel.find({});
    return posts;
  } catch (error: any) {
    logger.error(`Error fetching board posts: ${error.message}`);
    throw new Error(`Error fetching board posts: ${error.message}`);
  }
}
