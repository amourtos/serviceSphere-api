import { States } from '../../../util/enums/States.enum';

export interface Address {
  addressLine: string[];
  city: string;
  state: States;
  postalCode: string;
}
