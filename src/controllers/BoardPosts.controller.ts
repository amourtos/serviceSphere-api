import { Request, Response, Router } from 'express';
import { logger } from '../config/logger';
import { ApiResponseStatus } from '../models/ApiResponseStatus.model';

export class BoardPostsController {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get('/get/all', this.getAllPosts);
    this.router.get(`/get/:id`, this.getPostById);
    this.router.post('/create', this.createPost)
    this.router.patch('/edit/:id', this.editPost)
    this.router.delete('/delete/:id', this.deletePost)
  }

  private getAllPosts = async (req: Request, res: Response) => {
    try {
      logger.info('Request received.');
      return res.status(ApiResponseStatus.SUCCESS).json({ message: 'Success' });
    } catch (error: any) {
      logger.error('Error generating token:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
  };

  private getPostById = async (req: Request, res: Response) => {
    try {
      logger.info('Request received.');
      return res.status(ApiResponseStatus.SUCCESS).json({ message: 'Success' });
    } catch (error: any) {
      logger.error('Error generating token:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
  };

  private createPost = async (req: Request, res: Response) => {
    try {
      logger.info('Request received.');
      return res.status(ApiResponseStatus.SUCCESS).json({ message: 'Success' });
    } catch (error: any) {
      logger.error('Error generating token:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
  };

  private editPost = async (req: Request, res: Response) => {
    try {
      logger.info('Request received.');
      return res.status(ApiResponseStatus.SUCCESS).json({ message: 'Success' });
    } catch (error: any) {
      logger.error('Error generating token:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
  };

  private deletePost = async (req: Request, res: Response) => {
    try {
      logger.info('Request received.');
      return res.status(ApiResponseStatus.SUCCESS).json({ message: 'Success' });
    } catch (error: any) {
      logger.error('Error generating token:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
  };
}
