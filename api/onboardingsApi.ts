import {
  ICreateUpdateOnboarding,
  IOnBoardings,
  IOnBoardingsFullInfo,
  IResponse,
} from "@/typings";
import { privateAuthApi } from "./axios";
import { CreateOnboarding } from "@/app/(operations)/accounts/onboardings/[token]/page";

export const createOnboardingsFn = async (
  onboardings: ICreateUpdateOnboarding
) => {
  const response = await privateAuthApi.post<IResponse<IOnBoardings>>(
    `/admin/onboardings`,
    onboardings
  );
  return response.data;
};

export const registerOnboardingsFn = async (onboardings: CreateOnboarding) => {
  const response = await privateAuthApi.post<IResponse<IOnBoardings>>(
    `/admin/onboardings/register`,
    onboardings
  );
  return response.data;
};

export const getOnboardingFn = async (id: string) => {
  const response = await privateAuthApi.get<IResponse<IOnBoardingsFullInfo>>(
    `/admin/onboardings/${id}`
  );
  return response.data;
};

export const deleteOnboardingFn = async ({ id }: { id: string }) => {
  const response = await privateAuthApi.delete<IResponse<[]>>(
    `/admin/onboardings/${id}`
  );
  return response.data;
};

export const getByTokenFn = async (token: string) => {
  const response = await privateAuthApi.get<IResponse<IOnBoardingsFullInfo>>(
    `/admin/onboardings/get-by-token/${token}`
  );
  return response.data;
};
