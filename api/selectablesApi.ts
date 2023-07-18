import { IOrganization, IRegulators, IResponse, IUser } from "@/typings";
import { privateAuthApi } from "./axios";

type users = Omit<IUser, "role" | "permissions">;

export const getModelsFn = async () => {
  const response = await privateAuthApi.get<IResponse<string[]>>(
    `/selectables/log-models`
  );
  return response.data;
};

export const getUsersFn = async () => {
  const response = await privateAuthApi.get<IResponse<users[]>>(
    `/searchables/users`
  );
  return response.data;
};
export const getOrganizationListFn = async () => {
  const response = await privateAuthApi.get<IResponse<IOrganization[]>>(
    `/selectables/organizations`
  );
  return response.data;
};
export const getRegulatorListFn = async () => {
  const response = await privateAuthApi.get<IResponse<IRegulators[]>>(
    `/selectables/regulators`
  );
  return response.data;
};
