import { BoardPost, Tag } from '../models/BoardPost.model';
import { saveNewBoardPost } from '../mongoDB/database/BoardPost/boardPost.upload';
import { IBoardPost } from '../interfaces/BoardPost.interface';
import { ServiceUtil } from '../util/Service.util';
import { ServiceStatusEnum } from '../enums/ServiceStatus.enum';
import { IServiceResponse } from '../interfaces/ServiceResponse.interface';

export class BoardPostService {
  message = '';

  public async createBoardPost(
    userId: string,
    title: string,
    description: string,
    estimatedPrice: string,
    tags: Tag[]
  ): Promise<IServiceResponse> {
    // 1. generate new board post
    const boardPost: BoardPost = await BoardPost.generateNewBoardPost(userId, title, description, estimatedPrice, tags);
    // 2. save boardPost to DB
    const savedBoardPost: IBoardPost = await saveNewBoardPost(boardPost);
    if (!savedBoardPost) {
      this.message = `Error saving new post to DB: ${boardPost.boardPostId}`;
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_FAILURE, this.message, { boardPost });
    }

    this.message = 'boardPost created successfully.';
    return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, { boardPost });
  }
}
