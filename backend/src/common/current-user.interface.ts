import { Role } from './enums/role.enum';

export interface CurrentUserPayload {
  id: number;
  email: string;
  role: Role;
}