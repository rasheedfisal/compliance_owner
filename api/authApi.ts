import { LoginInput } from "../app/(auth)/login/page";
import { ILogin, IUser, IResponse } from "../typings";
import { authApi, privateAuthApi } from "./axios";

export const loginUserFn = async (user: LoginInput) => {
  const response = await authApi.post<IResponse<ILogin>>("/admin/login", user);
  return response.data;
};

export const logoutUserFn = async () => {
  const response = await privateAuthApi.post<IResponse<[]>>("/admin/logout");
  return response.data;
};

export const getProfileFn = async () => {
  const response = await privateAuthApi.get<IResponse<IUser>>("/admin/profile");
  return response.data;
};
