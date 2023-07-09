import { ICreateUpdateDomain, IDomain, IResponse } from "@/typings";
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
