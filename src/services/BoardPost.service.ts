import { BoardPost, Tag } from '../models/BoardPost.model';
import { saveNewBoardPost, editPost, deletePost } from '../mongoDB/database/BoardPost/boardPost.upload';
import { IBoardPost } from '../interfaces/BoardPost.interface';
import { ServiceUtil } from '../util/Service.util';
import { ServiceStatusEnum } from '../enums/ServiceStatus.enum';
import { IServiceResponse } from '../interfaces/ServiceResponse.interface';
import { getAllPostByUser, getAllPosts, getPostById } from '../mongoDB/database/BoardPost/boardPost.download';
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

  public async fetchAllBoardPosts(): Promise<IServiceResponse> {
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

  public async fetchBoardPostById(boardPostId: string): Promise<IServiceResponse> {
    logger.info(`Fetching boardPost:${boardPostId} --- START`);
    const boardPost: IBoardPost | null = await getPostById(boardPostId);
    if (!boardPost) {
      this.message = `Fetching boardPost:${boardPostId} --- ERROR`;
      logger.error(this.message);
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, { boardPost });
    }
    this.message = `BoardPost:${boardPost} retrieved successfully from DB`;
    logger.info(`Fetching boardPost:${boardPostId} --- COMPLETE`);
    return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, { boardPost });
  }

  public async fetchAllPostByUser(userId: string): Promise<IServiceResponse> {
    logger.info(`Fetching boardPosts:${userId} --- START`);
    const boardPosts: IBoardPost[] = await getAllPostByUser(userId);
    if (!boardPosts) {
      this.message = `Fetching boardPosts:${userId} --- ERROR`;
      logger.error(this.message);
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, { boardPosts });
    }
    this.message = `BoardPosts:${boardPosts} retrieved successfully from DB`;
    logger.info(`Fetching boardPost:${userId} --- COMPLETE`);
    return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, { boardPosts });
  }

  public async editBoardPost(boardPostId: string, boardPost: BoardPost): Promise<IServiceResponse> {
    logger.info(`Updating boardPost:${boardPostId} --- START`);
    const updatedPost: BoardPost | null = await editPost(boardPostId, boardPost);
    if (!updatedPost) {
      this.message = `Updating boardPost:${boardPostId} --- ERROR`;
      logger.error(this.message);
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, { updatedPost });
    }
    this.message = `BoardPost:${updatedPost} retrieved successfully from DB`;
    logger.info(`Updating boardPost:${boardPostId} --- COMPLETE`);
    return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, { updatedPost });
  }

  public async deleteBoardPost(boardPostId: string): Promise<IServiceResponse> {
    logger.info(`Deleting boardPost:${boardPostId} --- START`);
    const isDeleted: boolean = await deletePost(boardPostId);
    if (!isDeleted) {
      this.message = `Deleting boardPost:${boardPostId} --- ERROR`;
      logger.error(this.message);
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, {
        isDeleted: isDeleted
      });
    }
    this.message = `BoardPost:${boardPostId} Deleted successfully from DB`;
    logger.info(`Deleting boardPost:${boardPostId} --- COMPLETE`);
    return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, {
      isDeleted: isDeleted
    });
  }
}
