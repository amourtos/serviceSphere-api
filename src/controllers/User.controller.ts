import { Request, Response, Router } from 'express';
import { logger } from '../config/logger';
import { ApiResponseStatus } from '../models/ApiResponseStatus.model';
import { User } from '../models/User.model';
import { UserService } from '../services/User.service';
import { Constants } from '../util/constants';
import { Contact } from '../interfaces/Contact.interface';
import { Address } from '../interfaces/Address.interface';
import { IServiceResponse } from '../interfaces/ServiceResponse.interface';
import { ServiceStatusEnum } from '../enums/ServiceStatus.enum';
import authorizeToken from '../middleware/authorizeToken';
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
    this.router.post('/login', this.loginUser);
    this.router.post('/logout', authorizeToken, this.logoutUser);
    this.router.get('/get/:userId', authorizeToken, this.getUser);
    this.router.patch('/edit/contact/:userId', authorizeToken, this.editUserContact);
    this.router.patch('/edit/address/:userId', authorizeToken, this.editUserAddress);
    this.router.delete('/delete/:userId', authorizeToken, this.deleteUser);
  }

  private createUser = async (req: Request, res: Response): Promise<Response<IServiceResponse>> => {
    logger.info('createUser request received.');
    let serviceResponse: IServiceResponse;
    try {
      const { userType, password, contact, address } = req.body;
      // call service method to create new user

      serviceResponse = await this.userService.createUser(userType, password, contact, address);

      if (serviceResponse.status === ServiceStatusEnum.SERVICE_FAILURE) {
        logger.warn('User failed to create');
        return res.status(ApiResponseStatus.SERVICE_UNAVAILABLE).json(serviceResponse);
      }
      logger.info('User created successfully');
      return res.status(ApiResponseStatus.SUCCESS).json(serviceResponse);
    } catch (error: any) {
      logger.error('Error generating User:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
    return res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Something went wrong' });
  };

  private verifyUser = async (req: Request, res: Response): Promise<Response<IServiceResponse>> => {
    logger.info(`userId: ${req.params.userId} | verifyUser request received`);
    try {
      const verificationCode: string = req.body.verificationCode;
      const userId: string = req.params.userId;
      // check if verificationCode is valid
      const response: IServiceResponse = await this.userService.verifyAndUpdateUser(userId, verificationCode);
      return res.status(ApiResponseStatus.SUCCESS).json(response);
    } catch (error: any) {
      logger.error(`userId: ${req.params.userId} | error request received`, error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
    return res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Something went wrong' });
  };

  private getUser = async (req: Request, res: Response): Promise<Response<User> | undefined> => {
    logger.info('Request received.');
    try {
      const userId: string = req.params.userId;
      const response = {
        message: '',
        user: await this.userService.retrieveUser(userId)
      };
      // not found scenario
      if (!response.user) {
        response.message = Constants.NOT_FOUND;
        return res.status(ApiResponseStatus.NOT_FOUND).json(response);
      }
      response.message = Constants.SUCCESS;
      return res.status(ApiResponseStatus.SUCCESS).json(response);
    } catch (error: any) {
      logger.error('Error generating token:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
    return res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Something went wrong' });
  };

  private editUserContact = async (req: Request, res: Response): Promise<Response<IServiceResponse>> => {
    try {
      logger.info('Request received.');
      const contact: Contact = req.body.contact;
      const userId: string = req.params.userId;

      const updatedUser: IServiceResponse = await this.userService.updateUserContact(userId, contact);

      if (!updatedUser) return res.status(ApiResponseStatus.NOT_FOUND).json(updatedUser);

      return res.status(ApiResponseStatus.SUCCESS).json(updatedUser);
    } catch (error: any) {
      logger.error('Error updating user contact:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
    return res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Something went wrong' });
  };

  private editUserAddress = async (req: Request, res: Response): Promise<Response<IServiceResponse>> => {
    try {
      logger.info('Request received.');
      const address: Address = req.body.address;
      const userId: string = req.params.userId;

      const updatedUser: IServiceResponse = await this.userService.updateUserAddress(userId, address);
      if (!updatedUser) return res.status(ApiResponseStatus.NOT_FOUND).json(updatedUser);
      return res.status(ApiResponseStatus.SUCCESS).json(updatedUser);
    } catch (error: any) {
      logger.error('Error updating user address:', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
    return res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Something went wrong' });
  };

  private deleteUser = async (req: Request, res: Response): Promise<Response<IServiceResponse>> => {
    try {
      logger.info('Request received.');
      const userId: string = req.params.userId;
      const serviceResponse: IServiceResponse = await this.userService.deleteUser(userId);
      return res.status(ApiResponseStatus.SUCCESS).json(serviceResponse);
    } catch (error: any) {
      logger.error('Error deleting user: ', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
    return res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Something went wrong' });
  };

  private loginUser = async (req: Request, res: Response): Promise<Response<IServiceResponse>> => {
    try {
      logger.info('Request received.');
      const email: string = req.body.email;
      const password: string = req.body.password;
      const userId: string = req.body.userId;
      const serviceResponse: IServiceResponse = await this.userService.loginUser(email, password, userId);
      return res.status(ApiResponseStatus.SUCCESS).json(serviceResponse);
    } catch (error: any) {
      logger.error('Error Logging in user: ', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
    return res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Something went wrong' });
  };

  private logoutUser = async (req: Request, res: Response): Promise<Response<IServiceResponse>> => {
    try {
      logger.info('Request received to logout user.');
      const userId = req.params.userId;
      res.cookie('token', '');
      logger.info(`userId: ${userId} logged out.`);
      return res.status(ApiResponseStatus.SUCCESS).json({ message: 'User logged out successfully' });

      // const serviceResponse = this.userService.logoutUser(userId);
      // code here
      // const token = req.header['Authorization']?.split(' ')[1];
    } catch (error: any) {
      logger.error('Error logging out the user: ', error.message);
      res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Backend service unavailable', error: error.message });
    }
    return res.status(ApiResponseStatus.SERVER_ERROR).json({ message: 'Something went wrong' });
  };
}
