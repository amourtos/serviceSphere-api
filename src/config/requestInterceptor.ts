import { AxiosInstance } from 'axios';
import { logger } from './logger';

export class RequestInterceptor {
  axiosInstance: AxiosInstance;
  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
    // Add request interceptor
    axiosInstance.interceptors.request.use((request) => {
      // Log the entire URL and type of request
      logger.info(`Making ${request.method?.toUpperCase()} to --> ${request.baseURL}${request.url}`);
      // logger.info(`Outgoing request --> ${JSON.stringify(request)}`);
      logger.debug(`Outgoing request headers --> ${request.headers}`);

      // TODO: uncomment this line for debugging Tilled
      // if (request.method?.toUpperCase() != 'GET')
      logger.debug(`Outgoing request body --> ${JSON.stringify(request.data)}`);
      return request;
    });
  }
}
