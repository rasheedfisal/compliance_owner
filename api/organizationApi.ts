import { IOrganization, IResponse } from "@/typings";
import { privateAuthApi } from "./axios";

export const createOrganizationFn = async (formData: FormData) => {
  const response = await privateAuthApi.post<IResponse<IOrganization>>(
    `/admin/organizations`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const updateOrganizationFn = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}) => {
  const response = await privateAuthApi.post<IResponse<IOrganization>>(
    `/admin/organizations/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const getOrganizationFn = async (id: string) => {
  const response = await privateAuthApi.get<IResponse<IOrganization>>(
    `/admin/organizations/${id}`
  );
  return response.data;
};

export const getTrashedOrganizationsCountFn = async () => {
  const response = await privateAuthApi.get<IResponse<number>>(
    `/admin/organizations/trashed-count`
  );
  return response.data;
};

export const getAllOrganizationsFn = async () => {
  const response = await privateAuthApi.get<IResponse<IOrganization[]>>(
    `/selectables/organizations`
  );
  return response.data;
};

export const getAllOrganizationTypesFn = async () => {
  const response = await privateAuthApi.get<IResponse<string[]>>(
    `/selectables/organization-types`
  );
  return response.data;
};

export const moveOrganizationToTrashFn = async ({ id }: { id: string }) => {
  const response = await privateAuthApi.delete<IResponse<[]>>(
    `/admin/organizations/${id}`
  );
  return response.data;
};
export const restoreOrganizationFn = async ({ id }: { id: string }) => {
  const response = await privateAuthApi.post<IResponse<IOrganization>>(
    `/admin/organizations/${id}/restore`
  );
  return response.data;
};
export const deleteOrganizationFn = async ({ id }: { id: string }) => {
  const response = await privateAuthApi.delete<IResponse<[]>>(
    `/admin/organizations/${id}/delete`
  );
  return response.data;
};
