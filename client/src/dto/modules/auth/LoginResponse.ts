import type { AuthUserDTO } from "../../common/AuthUserDTO";

export type LoginResponse = {
  statusCode: number;
  loginStatus: boolean;
  accessToken: string;
  refreshToken: string;
  user: AuthUserDTO;
  serverMessage?: string;
};