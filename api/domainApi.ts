import {
  ICreateUpdateDomain,
  IDomain,
  IDomainFull,
  IResponse,
} from "@/typings";
import { privateAuthApi } from "./axios";

export const createDomainFn = async (domain: ICreateUpdateDomain) => {
  const response = await privateAuthApi.post<IResponse<IDomain>>(
    `/admin/domains`,
    domain
  );
  return response.data;
};

export const updateDomainFn = async ({
  id,
  domain,
}: {
  id: string;
  domain: ICreateUpdateDomain;
}) => {
  const response = await privateAuthApi.put<IResponse<IDomain>>(
    `/admin/domains/${id}`,
    domain
  );
  return response.data;
};

export const getDominFn = async (id: string) => {
  const response = await privateAuthApi.get<IResponse<IDomainFull>>(
    `/admin/domains/${id}`
  );
  return response.data;
};

export const getTrashedDominFn = async () => {
  const response = await privateAuthApi.get<IResponse<IResponse<number>>>(
    `/admin/domains/trashed-count`
  );
  return response.data;
};
