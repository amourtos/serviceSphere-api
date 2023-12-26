import { BoardReply } from '../../../models/BoardReply.model';
import { IBoardReply } from '../../../interfaces/BoardReply.interface';
import { logger } from '../../../config/logger';
import { UserModel } from '../../schemas/User.schema';
import { BoardReplyModel } from '../../schemas/BoardReply.schema';

export async function saveNewBoardReply(boardReply: BoardReply): Promise<IBoardReply> {
  try {
    logger.info(`userId: ${boardReply.boardReplyId} | Saving new BoardReply to collection`);
    const boardReplyInstance = new BoardReplyModel(boardReply);
    const savedBoardReply = await boardReplyInstance.save();
    logger.info(`userId: ${boardReply.boardReplyId} | BoardReply saved successfully`);
    return savedBoardReply;
  } catch (error: any) {
    logger.error(`Error saving BoardReply: ${error.message}`);
    throw new Error(`Failed to save BoardReply: ${error.message}`);
  }
}
