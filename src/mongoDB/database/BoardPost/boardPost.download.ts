import { logger } from '../../../config/logger';
import { BoardPostModel } from '../../schemas/BoardPost.schema';
import { IBoardPost } from '../../../interfaces/BoardPost.interface';

export async function getAllPosts(): Promise<IBoardPost[]> {
  let posts: IBoardPost[];
  logger.info('Getting all board posts');
  try {
    posts = await BoardPostModel.find({});
    return posts;
  } catch (error: any) {
    const errorMessage = `Error fetching board posts: ${error.message}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
}

export async function getPostById(postId: string): Promise<IBoardPost | null> {
  let post: IBoardPost | null = null;
  logger.info(`Fetching board post by Id:${postId}`);
  try {
    const query = { boardPostId: postId };
    post = await BoardPostModel.findOne(query);
    return post;
  } catch (error: any) {
    const errorMessage = `Error fetching board post: ${postId} error: ${error.message}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
}

export async function getAllPostByUser(userId: string): Promise<IBoardPost[]> {
  let posts: IBoardPost[];
  logger.info(`Fetching all boardPosts by user:${userId}`);
  try {
    const query = { userId: userId };
    posts = await BoardPostModel.find(query);
    return posts;
  } catch (error: any) {
    const errorMessage = `Error fetching board posts by user:${userId}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
}
