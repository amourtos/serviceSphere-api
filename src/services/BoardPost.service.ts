import { BoardPost, Tag } from '../models/BoardPost.model';
import { saveNewBoardPost } from '../mongoDB/database/BoardPost/boardPost.upload';
import { IBoardPost } from '../interfaces/BoardPost.interface';
import { ServiceUtil } from '../util/Service.util';
import { ServiceStatusEnum } from '../enums/ServiceStatus.enum';
import { IServiceResponse } from '../interfaces/ServiceResponse.interface';
import { getAllPosts } from '../mongoDB/database/BoardPost/boardPost.download';
import { logger } from '../config/logger';

export class BoardPostService {
  message = '';

  public async createBoardPost(
    userId: string,
    title: string,
    description: string,
    estimatedPrice: string,
    tags: Tag[]
  ): Promise<IServiceResponse> {
    logger.info('Creating BoardPost --- START');
    // 1. generate new board post
    const boardPost: BoardPost = await BoardPost.generateNewBoardPost(userId, title, description, estimatedPrice, tags);
    // 2. save boardPost to DB
    const savedBoardPost: IBoardPost = await saveNewBoardPost(boardPost);
    if (!savedBoardPost) {
      this.message = `Error saving new post to DB: ${boardPost.boardPostId}`;
      logger.info(`Creating BoardPost --- ERROR: ${this.message}`);
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_FAILURE, this.message, { boardPost });
    }

    logger.info('Creating BoardPost --- COMPLETE');
    this.message = 'boardPost created successfully.';
    return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, { boardPost });
  }

  public async getAllBoardPosts(): Promise<IServiceResponse> {
    logger.info('Fetching BoardPosts --- START');

    const posts: BoardPost[] = await getAllPosts();
    if (!posts) {
      this.message = 'Error retrieving posts from DB';
      logger.info(`Fetching BoardPosts --- ERROR:${this.message}`);
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_FAILURE, this.message, { posts });
    }
    this.message = 'BoardPosts retrieved successfully';
    logger.info(`Fetching BoardPosts --- SUCCESS`);
    return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, { posts });
  }
}
