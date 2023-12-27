import { IServiceResponse } from '../interfaces/ServiceResponse.interface';
import { logger } from '../config/logger';
import { BoardReply } from '../models/BoardReply.model';
import { IBoardReply } from '../interfaces/BoardReply.interface';
import { saveNewBoardReply } from '../mongoDB/database/BoardReply/BoardReply.upload';
import { ServiceUtil } from '../util/Service.util';
import { ServiceStatusEnum } from '../enums/ServiceStatus.enum';
import { getAllRepliesByPostId, getBoardReplyById } from '../mongoDB/database/BoardReply/BoardReply.download';

export class BoardReplyService {
  message = '';

  public async createBoardReply(
    userId: string,
    boardPostId: string,
    comment: string,
    price: string
  ): Promise<IServiceResponse> {
    logger.info('Creating BoardReply --- START');
    // 1. generate boardReply
    const boardReply: BoardReply = await BoardReply.generateBoardReply(userId, boardPostId, comment, price);
    // 2. Save boardReply to DB
    const savedBoardReply: IBoardReply = await saveNewBoardReply(boardReply);
    if (!savedBoardReply) {
      this.message = `Error saving new BoardReply to DB: ${boardReply.boardReplyId}`;
      logger.warn(`Creating BoardReply --- ERROR: ${this.message}`);
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_FAILURE, this.message, { boardReply });
    }

    logger.info('Creating BoardReply --- COMPLETE');
    this.message = 'BoardReply created successfully';
    return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, { boardReply });
  }

  public async fetchBoardReplyById(boardReplyId: string): Promise<IServiceResponse> {
    logger.info(`Fetching BoardReply:${boardReplyId} --- START`);
    const boardReply: BoardReply | null = await getBoardReplyById(boardReplyId);
    if (!boardReplyId) {
      this.message = `Error fetching boardReplyById:${boardReplyId}`;
      logger.error(`Fetching BoardReply:${boardReplyId} --- ERROR: ${this.message}`);
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_FAILURE, this.message, { boardReply });
    }
    logger.info(`Fetching BoardReply:${boardReplyId} --- COMPLETE`);
    this.message = `Fetching BoardReply by ID: success`;
    return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, { boardReply });
  }

  public async fetchBoardRepliesByPostId(boardPostId: string): Promise<IServiceResponse> {
    logger.info(`Fetching BoardReplies by postId:${boardPostId} --- START`);
    const boardReplies: BoardReply[] = await getAllRepliesByPostId(boardPostId);
    if (!boardPostId) {
      this.message = `Error fetching boardReplies by postId:${boardPostId}`;
      logger.error(`Fetching BoardReply:${boardPostId} --- ERROR: ${this.message}`);
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_FAILURE, this.message, {
        boardReply: boardReplies
      });
    }
    logger.info(`Fetching BoardReply:${boardPostId} --- COMPLETE`);
    this.message = `Fetching BoardReply by ID: success`;
    return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, {
      boardReply: boardReplies
    });
  }
}
