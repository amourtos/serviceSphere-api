import { IBoardReply } from '../../../interfaces/BoardReply.interface';
import { logger } from '../../../config/logger';
import { BoardReplyModel } from '../../schemas/BoardReply.schema';

export async function getBoardReplyById(boardReplyId: string): Promise<IBoardReply | null> {
  let boardReply: IBoardReply | null = null;
  logger.info(`Fetching boardReply by Id:${boardReplyId}`);
  try {
    const query = { boardReplyId: boardReplyId };
    boardReply = await BoardReplyModel.findOne(query);
    return boardReply;
  } catch (error: any) {
    const errorMessage = `Error fetching boardReply: ${boardReplyId} error: ${error.message}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
}

export async function getAllRepliesByPostId(boardPostId: string): Promise<IBoardReply[]> {
  let replies: IBoardReply[];
  logger.info(`Fetching all boardReplies by postId: ${boardPostId}`);
  try {
    const query = { boardPostId: boardPostId };
    replies = await BoardReplyModel.find(query);
    return replies;
  } catch (error: any) {
    const errorMessage = `Error fetching boardReplies: BoardPostId:${boardPostId} error: ${error.message}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
}
