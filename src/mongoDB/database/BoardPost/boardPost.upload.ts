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

export async function editPost(boardPostId: string, boardPost: IBoardPost): Promise<IBoardPost | null> {
  logger.info(`Editing boardPost:${boardPostId}`);
  try {
    const query = { boardPostId: boardPostId };
    // The { new: true } option ensures that the updated document is returned
    const updatedPost = await BoardPostModel.findByIdAndUpdate(query, boardPost, { new: true });
    return updatedPost;
  } catch (error: any) {
    const errorMessage = `Error updating boardPost:${boardPostId} Error: ${error.message}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
}

export async function deletePost(boardPostId: string): Promise<boolean> {
  logger.info(`Deleting boardPost with Id: ${boardPostId}`);
  try {
    const query = { boardPostId: boardPostId };
    // Using deleteOne to perform the deletion
    const result = await BoardPostModel.deleteOne(query);

    // Check if at least one document was deleted (result.deletedCount > 0)
    return !!(result.deletedCount && result.deletedCount > 0);
  } catch (error: any) {
    const errorMessage = `Error deleting boardPost with Id: ${boardPostId} Error: ${error.message}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
}
