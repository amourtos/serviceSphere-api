import { ServiceStatusEnum } from '../enums/ServiceStatus.enum';
import { IServiceResponse } from '../interfaces/ServiceResponse.interface';
import { logger } from '../config/logger';

export class ServiceUtil {
  public static generateServiceResponse(status: ServiceStatusEnum, message: string, data: object): IServiceResponse {
    logger.info('Generating service response.');
    return {
      status: status,
      message: message,
      data: data
    };
  }
}
