import { IUser } from '../User.interface';

export interface Icontractor extends IUser {
  contractorId: string;
  isContractor: boolean;
  incrementingNumber: number;
}
