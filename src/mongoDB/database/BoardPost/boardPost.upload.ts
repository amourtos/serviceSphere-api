import { BoardPost } from '../../../models/BoardPost.model';
import { IBoardPost } from '../../../interfaces/BoardPost.interface';
import { logger } from '../../../config/logger';
import { BoardPostModel } from '../../schemas/BoardPost.schema';

export async function saveNewBoardPost(boardPost: BoardPost): Promise<IBoardPost> {
  try {
    logger.info(`boardPostId:${boardPost.boardPostId} | Saving new boardPost to collection`);
    const boardPostInstance = new BoardPostModel(boardPost);
    const savedBoardPost = await boardPostInstance.save();
    logger.info(`boardPostId:${boardPost.boardPostId} | Saved successfully`);
    return savedBoardPost;
  } catch (error: any) {
    logger.error(`Error saving post: ${error.message}`);
    throw new Error('Failed to save boardPost');
  }
}
