import { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';
import jwt, { VerifyErrors, VerifyOptions } from 'jsonwebtoken'; // Import VerifyErrors and VerifyOptions for better type checking
import { ApiResponseStatus } from '../models/ApiResponseStatus.model';
import { secretKey } from '../config/secretKey';

function authorizeToken(req: Request, res: Response, next: NextFunction) {
  logger.info('Authorizing token');
  const token: string | undefined = req.cookies.token;
  logger.info(`Authenticating token: ${token}`);
  if (!token) {
    return res.sendStatus(ApiResponseStatus.UNAUTHORIZED);
  }

  const verifyOptions: VerifyOptions = {
    algorithms: ['HS256'] // Specify the algorithm used to sign the token
  };

  jwt.verify(token, secretKey, verifyOptions, (err: VerifyErrors | null) => {
    if (err) {
      logger.error(`Token verification error: ${err.message}`);
      return res.sendStatus(ApiResponseStatus.FORBIDDEN);
    }
    logger.info('Token authentication success.');
    next();
  });
}

export default authorizeToken;
