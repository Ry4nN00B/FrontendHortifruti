export type RegisterDTO = Omit<UserModel, 'id'>;

export interface UserModel {
  id?: string;
  name: string;
  email: string;
  password: string;
  roles: string[];
}

export interface LoginDTO {
  email: string;
  password: string;
}