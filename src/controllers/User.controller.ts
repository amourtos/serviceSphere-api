import { Request, Response, Router } from 'express';
import { logger } from '../config/logger';
import { ApiResponseStatus } from '../models/ApiResponseStatus.model';
import { User } from '../models/User/User.model';
import { UserService } from '../services/User.service';

export class UserController {
  public router: Router;
  private userService: UserService;

  constructor() {
    this.router = Router();
    this.initRoutes();
    this.userService = new UserService();
  }

  private initRoutes(): void {
    this.router.post('/create', this.createUser);
    this.router.get('/get/:id', this.getUser);
    this.router.patch('/edit/:id', this.editUser);
    this.router.delete('/delete/:id', this.deleteUser);
  }

  private createUser = async (req: Request, res: Response): Promise<Response<User> | undefined> => {
    logger.info('createUser request received.');
    try {
      const { customer, contractor, contact, address } = req.body;
      // call service method to create new user
      const newUser: User = await this.userService.createUser(customer, contractor, contact, address);
      const response: object = {
        message: 'User created successfully.',
        data: newUser
      };
      return res.status(ApiResponseStatus.SUCCESS).json(response);
    } catch (error: any) {
      logger.error('Error generating User:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
  };

  private getUser = async (req: Request, res: Response): Promise<Response<User> | undefined> => {
    try {
      logger.info('Request received.');
      return res.status(ApiResponseStatus.SUCCESS).json({ message: 'Success' });
    } catch (error: any) {
      logger.error('Error generating token:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
  };

  private editUser = async (req: Request, res: Response): Promise<Response<User> | undefined> => {
    try {
      logger.info('Request received.');
      return res.status(ApiResponseStatus.SUCCESS).json({ message: 'Success' });
    } catch (error: any) {
      logger.error('Error generating token:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
  };

  private deleteUser = async (req: Request, res: Response): Promise<Response<User> | undefined> => {
    try {
      logger.info('Request received.');
      return res.status(ApiResponseStatus.SUCCESS).json({ message: 'Success' });
    } catch (error: any) {
      logger.error('Error generating token:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
  };
}
