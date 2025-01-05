import { States } from '../enums/States.enum';

export interface Address {
  addressLine: string[];
  city: string;
  state: States;
  postalCode: string;
}
