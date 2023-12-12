import { Request, Response, Router } from 'express';
import { logger } from '../config/logger';
import { ApiResponseStatus } from '../models/ApiResponseStatus.model';
import { User } from '../models/User.model';
import { UserService } from '../services/User.service';
import { validateVerificationCode } from '../database/verificationCode.download';
import { markUserAsVerified } from '../database/user.upload';
import { Constants } from '../util/constants';
import { Contact } from '../interfaces/Contact.interface';
import { Address } from '../interfaces/Address.interface';

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
    this.router.post('/verify/:userId', this.verifyUser);
    this.router.get('/get/:userId', this.getUser);
    this.router.patch('/edit/contact/:userId', this.editUserContact);
    this.router.patch('/edit/address/:userId', this.editUserAddress);
    this.router.delete('/delete/:userId', this.deleteUser);
  }

  private createUser = async (req: Request, res: Response): Promise<Response<User> | undefined> => {
    logger.info('createUser request received.');
    try {
      const { userType, contact, address } = req.body;
      // call service method to create new user
      const newUser: User = await this.userService.createUser(userType, contact, address);
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

  private verifyUser = async (req: Request, res: Response): Promise<any> => {
    logger.info(`userId: ${req.params.userId} | verifyUser request received`);
    try {
      const verificationCode: string = req.body.verificationCode;
      const userId: string = req.params.userId;
      // check if verificationCode is valid
      const response = await this.userService.verifyAndUpdateUser(userId, verificationCode);
      return res.status(ApiResponseStatus.SUCCESS).json(response);
    } catch (error: any) {
      logger.error(`userId: ${req.params.userId} | error request received`, error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
  };

  private getUser = async (req: Request, res: Response): Promise<Response<User> | undefined> => {
    logger.info('Request received.');
    const response = {
      message: '',
      user: null
    };
    try {
      const userId: string = req.params.userId;
      const user: User | null = await this.userService.retrieveUser(userId);
      // not found scenario
      if (!user) {
        return res.status(ApiResponseStatus.NOT_FOUND).json(response);
      }
      return res.status(ApiResponseStatus.SUCCESS).json({ message: Constants.SUCCESS });
    } catch (error: any) {
      logger.error('Error generating token:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
  };

  private editUserContact = async (req: Request, res: Response): Promise<Response<User> | undefined> => {
    try {
      logger.info('Request received.');
      const contact: Contact = req.body.contact;
      const userId: string = req.params.userId;
      const response = {
        message: '',
        user: null
      };
      const updatedUser: User | null = await this.userService.updateUserContact(userId, contact);
      if (!updatedUser) return res.status(ApiResponseStatus.NOT_FOUND).json(response);
      return res.status(ApiResponseStatus.SUCCESS).json({ message: 'Success' });
    } catch (error: any) {
      logger.error('Error generating token:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
  };

  private editUserAddress = async (req: Request, res: Response): Promise<Response<User> | undefined> => {
    try {
      logger.info('Request received.');
      const address: Address = req.body.address;
      const userId: string = req.params.userId;
      const response = {
        message: '',
        user: null
      };
      const updatedUser: User | null = await this.userService.updateUserAddress(userId, address);
      if (!updatedUser) return res.status(ApiResponseStatus.NOT_FOUND).json(response);
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
