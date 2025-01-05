import { ServiceStatusEnum } from '../enums/ServiceStatus.enum';

export interface IServiceResponse {
  status: ServiceStatusEnum;
  message: string;
  data: any;
}
