import {
  ICreateUpdateSubDomain,
  ISubDomain,
  ISubDomainFull,
  IResponse,
} from "@/typings";
import { privateAuthApi } from "./axios";

export const createSubDomainFn = async (domain: ICreateUpdateSubDomain) => {
  const response = await privateAuthApi.post<IResponse<ISubDomain>>(
    `/admin/sub-domains`,
    domain
  );
  return response.data;
};

export const updateSubDomainFn = async ({
  id,
  subdomain,
}: {
  id: string;
  subdomain: ICreateUpdateSubDomain;
}) => {
  const response = await privateAuthApi.put<IResponse<ISubDomain>>(
    `/admin/sub-domains/${id}`,
    subdomain
  );
  return response.data;
};

export const getSubDominFn = async (id: string) => {
  const response = await privateAuthApi.get<IResponse<ISubDomain>>(
    `/admin/sub-domains/${id}`
  );
  return response.data;
};

export const getTrashedSubDominCountFn = async () => {
  const response = await privateAuthApi.get<IResponse<number>>(
    `/admin/sub-domains/trashed-count`
  );
  return response.data;
};

export const getAllSubDominFn = async () => {
  const response = await privateAuthApi.get<IResponse<ISubDomainFull[]>>(
    `/selectables/sub-domains`
  );
  return response.data;
};

export const moveSubDomainToTrashFn = async ({ id }: { id: string }) => {
  const response = await privateAuthApi.delete<IResponse<[]>>(
    `/admin/sub-domains/${id}`
  );
  return response.data;
};
export const restoreSubDomainFn = async ({ id }: { id: string }) => {
  const response = await privateAuthApi.post<IResponse<ISubDomainFull>>(
    `/admin/sub-domains/${id}/restore`
  );
  return response.data;
};
export const deleteSubDomainFn = async ({ id }: { id: string }) => {
  const response = await privateAuthApi.delete<IResponse<[]>>(
    `/admin/sub-domains/${id}/delete`
  );
  return response.data;
};
