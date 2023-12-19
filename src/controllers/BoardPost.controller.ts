import { Request, Response, Router } from 'express';
import { logger } from '../config/logger';
import { ApiResponseStatus } from '../models/ApiResponseStatus.model';
import { BoardPost } from '../models/BoardPost.model';
import authorizeToken from '../middleware/authorizeToken';
import { BoardPostService } from '../services/BoardPost.service';
import { IServiceResponse } from '../interfaces/ServiceResponse.interface';
import { ServiceStatusEnum } from '../enums/ServiceStatus.enum';

export class BoardPostController {
  public router: Router;
  private boardPostService: BoardPostService;
  constructor() {
    this.router = Router();
    this.boardPostService = new BoardPostService();
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get('/get/all', authorizeToken, this.getAllPosts);
    this.router.get(`/get/:id`, authorizeToken, this.getPostById);
    this.router.get('/get/all/user/:id', authorizeToken, this.getPostsByUserId);
    this.router.post('/create', authorizeToken, this.createPost);
    this.router.patch('/edit/:id', authorizeToken, this.editPost);
    this.router.delete('/delete/:id', authorizeToken, this.deletePost);
  }

  private createPost = async (req: Request, res: Response): Promise<Response<BoardPost> | undefined> => {
    let serviceResponse: IServiceResponse;
    try {
      logger.info('CreatePost request received.');
      const { userId, title, description, estimatedPrice, tags } = req.body;
      serviceResponse = await this.boardPostService.createBoardPost(userId, title, description, estimatedPrice, tags);
      if (serviceResponse.status === ServiceStatusEnum.SERVICE_FAILURE) {
        logger.error('Board Post failed to create');
        return res.status(ApiResponseStatus.SERVICE_UNAVAILABLE).json(serviceResponse);
      }
      logger.info('Board post created successfully');
      return res.status(ApiResponseStatus.SUCCESS).json(serviceResponse);
    } catch (error: any) {
      logger.error('Error creating board post:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
  };

  private getAllPosts = async (req: Request, res: Response): Promise<Response<BoardPost[]> | undefined> => {
    let serviceResponse: IServiceResponse;
    try {
      logger.info('getAllPosts Request received.');
      serviceResponse = await this.boardPostService.fetchAllBoardPosts();
      if (serviceResponse.status === ServiceStatusEnum.SERVICE_FAILURE) {
        logger.error('Failed to fetch boardPosts');
        return res.status(ApiResponseStatus.SERVICE_UNAVAILABLE).json(serviceResponse);
      }
      return res.status(ApiResponseStatus.SUCCESS).json(serviceResponse);
    } catch (error: any) {
      logger.error('Error generating token:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
  };

  private getPostById = async (req: Request, res: Response): Promise<Response<BoardPost> | undefined> => {
    try {
      logger.info('getPostById Request received.');
      const postId: string = req.params.id;

      return res.status(ApiResponseStatus.SUCCESS).json({ message: 'Success' });
    } catch (error: any) {
      logger.error('Error generating token:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
  };

  private getPostsByUserId = async (req: Request, res: Response): Promise<Response<BoardPost> | undefined> => {
    try {
      logger.info('Request received.');
      return res.status(ApiResponseStatus.SUCCESS).json({ message: 'Success' });
    } catch (error: any) {
      logger.error('Error generating token:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
  };

  private editPost = async (req: Request, res: Response): Promise<Response<BoardPost> | undefined> => {
    try {
      logger.info('Request received.');
      return res.status(ApiResponseStatus.SUCCESS).json({ message: 'Success' });
    } catch (error: any) {
      logger.error('Error generating token:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
  };

  private deletePost = async (req: Request, res: Response): Promise<Response<BoardPost> | undefined> => {
    try {
      logger.info('Request received.');
      return res.status(ApiResponseStatus.SUCCESS).json({ message: 'Success' });
    } catch (error: any) {
      logger.error('Error generating token:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
  };
}
