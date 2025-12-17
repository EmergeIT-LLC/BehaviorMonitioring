import type { AuthUserDTO } from "../../common/AuthUserDTO";

export type LoginResponse = {
  statusCode: number;
  loginStatus: boolean;
  user: AuthUserDTO;
  serverMessage?: string;
};