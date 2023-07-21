import {
  ICreateUpdateInvitation,
  ICreateUpdateOnboarding,
  IInvitation,
  IInvitationsFullInfo,
  IOnBoardings,
  IOnBoardingsFullInfo,
  IResponse,
} from "@/typings";
import { privateAuthApi } from "./axios";
import { CreateOnboarding } from "@/app/(operations)/accounts/onboardings/[token]/page";
import { CreateInvitation } from "@/app/(operations)/accounts/invitations/[token]/page";

export const createOnboardingsFn = async (
  onboardings: ICreateUpdateOnboarding
) => {
  const response = await privateAuthApi.post<IResponse<IOnBoardings>>(
    `/admin/onboardings`,
    onboardings
  );
  return response.data;
};

export const createInvitationFn = async (
  invitation: ICreateUpdateInvitation
) => {
  const response = await privateAuthApi.post<IResponse<IInvitation>>(
    `/admin/invitations`,
    invitation
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
export const registerInvitationFn = async (invitation: CreateInvitation) => {
  const response = await privateAuthApi.post<IResponse<IInvitation>>(
    `/admin/invitations/register`,
    invitation
  );
  return response.data;
};

export const getOnboardingFn = async (id: string) => {
  const response = await privateAuthApi.get<IResponse<IOnBoardingsFullInfo>>(
    `/admin/onboardings/${id}`
  );
  return response.data;
};
export const getInvitationFn = async (id: string) => {
  const response = await privateAuthApi.get<IResponse<IInvitationsFullInfo>>(
    `/admin/invitations/${id}`
  );
  return response.data;
};

export const deleteOnboardingFn = async ({ id }: { id: string }) => {
  const response = await privateAuthApi.delete<IResponse<[]>>(
    `/admin/onboardings/${id}`
  );
  return response.data;
};
export const deleteInvitationFn = async ({ id }: { id: string }) => {
  const response = await privateAuthApi.delete<IResponse<[]>>(
    `/admin/invitations/${id}`
  );
  return response.data;
};

export const getByTokenFn = async (token: string) => {
  const response = await privateAuthApi.get<IResponse<IOnBoardingsFullInfo>>(
    `/admin/onboardings/get-by-token/${token}`
  );
  return response.data;
};
export const getInvitationByTokenFn = async (token: string) => {
  const response = await privateAuthApi.get<IResponse<IInvitationsFullInfo>>(
    `/admin/invitations/get-by-token/${token}`
  );
  return response.data;
};
