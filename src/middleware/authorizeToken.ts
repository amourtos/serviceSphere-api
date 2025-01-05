import { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';
import jwt, { VerifyErrors, VerifyOptions } from 'jsonwebtoken';
import { ApiResponseStatus } from '../enums/ApiResponseStatus.enum';
import { secretKey } from '../config/secretKey';
import dotenv from 'dotenv';

dotenv.config();

function authorizeToken(req: Request, res: Response, next: NextFunction) {
  console.log(req.headers);
  logger.info('Authorizing token');

  // Get the token from the Authorization header (remove 'Bearer ' prefix if present)
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(';')[0].split('=')[1] : undefined;

  logger.info(`Authenticating token: ${token}`);
  if (!token) {
    return res.sendStatus(ApiResponseStatus.UNAUTHORIZED);
  }

  // Check if it's the admin token first
  if (token === process.env.ADMIN_TOKEN) {
    logger.info('Administrator token access granted');
    return next(); // Grant access immediately
  }

  const verifyOptions: VerifyOptions = {
    algorithms: ['HS256']
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
