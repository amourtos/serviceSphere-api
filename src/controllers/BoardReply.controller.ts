import { Request, Response, Router } from 'express';
import { BoardReply } from '../models/BoardReply.model';
import authorizeToken from '../middleware/authorizeToken';
import { IServiceResponse } from '../interfaces/ServiceResponse.interface';
import { logger } from '../config/logger';
import { BoardReplyService } from '../services/BoardReply.service';
import { ServiceStatusEnum } from '../enums/ServiceStatus.enum';
import { ApiResponseStatus } from '../enums/ApiResponseStatus.enum';

export class BoardReplyController {
  public router: Router;
  private boardReplyService: BoardReplyService;

  constructor() {
    this.router = Router();
    this.boardReplyService = new BoardReplyService();
  }

  private initRoutes(): void {
    this.router.post('/create', authorizeToken, this.createBoardReply);
    this.router.get('/get/all/:boardPostId', authorizeToken, this.fetchByBoardPostId);
    this.router.get('/get/:boardReplyId', authorizeToken, this.fetchByBoardReplyId);
  }

  private async createBoardReply(req: Request, res: Response): Promise<Response<BoardReply> | undefined> {
    let serviceResponse: IServiceResponse;
    try {
      logger.info('Create BoardReply request received.');
      const { boardPostId, userId, comment, price } = req.body;
      serviceResponse = await this.boardReplyService.createBoardReply(userId, boardPostId, comment, price);
      if (serviceResponse.status === ServiceStatusEnum.SERVICE_FAILURE) {
        logger.error('BoardReply failed to create.');
        return res.status(ApiResponseStatus.SERVICE_UNAVAILABLE).json(serviceResponse);
      }
      logger.info('BoardReply created successfully.');
      return res.status(ApiResponseStatus.SUCCESS).json(serviceResponse);
    } catch (error: any) {
      logger.error('Error creating board post:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
  }

  private fetchByBoardPostId = async (req: Request, res: Response): Promise<Response<BoardReply[]> | undefined> => {
    let serviceResponse: IServiceResponse;
    try {
      logger.info('fetching BoardReplies by PostId.');
      const boardPostId = req.params.boardPostId;
      serviceResponse = await this.boardReplyService.fetchBoardRepliesByPostId(boardPostId);
      if (serviceResponse.status === ServiceStatusEnum.SERVICE_FAILURE) {
        logger.error('BoardReplies failed to fetch.');
        return res.status(ApiResponseStatus.SERVICE_UNAVAILABLE).json(serviceResponse);
      }
      logger.info('BoardReplies fetched successfully.');
      return res.status(ApiResponseStatus.SUCCESS).json(serviceResponse);
    } catch (error: any) {
      logger.error('Error fetching BoardReplies:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
  };

  private async fetchByBoardReplyId(req: Request, res: Response): Promise<Response<BoardReply> | undefined> {
    let serviceResponse: IServiceResponse;
    try {
      logger.info('fetching BoardReply by PostId.');
      const boardReplyId = req.params.boardReplyId;
      serviceResponse = await this.boardReplyService.fetchBoardReplyById(boardReplyId);
      if (serviceResponse.status === ServiceStatusEnum.SERVICE_FAILURE) {
        logger.error('BoardReply failed to fetch.');
        return res.status(ApiResponseStatus.SERVICE_UNAVAILABLE).json(serviceResponse);
      }
      logger.info('BoardReply fetched successfully.');
      return res.status(ApiResponseStatus.SUCCESS).json(serviceResponse);
    } catch (error: any) {
      logger.error('Error fetching BoardReply:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
  }
}
