import { IRegulators, IResponse } from "@/typings";
import { privateAuthApi } from "./axios";

export const createRegulatorFn = async (formData: FormData) => {
  const response = await privateAuthApi.post<IResponse<IRegulators>>(
    `/admin/regulators`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const updateRegulatorFn = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}) => {
  const response = await privateAuthApi.post<IResponse<IRegulators>>(
    `/admin/regulators/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const getRequlatorFn = async (id: string) => {
  const response = await privateAuthApi.get<IResponse<IRegulators>>(
    `/admin/regulators/${id}`
  );
  return response.data;
};

export const getTrashedRegulatorsCountFn = async () => {
  const response = await privateAuthApi.get<IResponse<number>>(
    `/admin/regulators/trashed-count`
  );
  return response.data;
};

export const getAllRegulatorsFn = async () => {
  const response = await privateAuthApi.get<IResponse<IRegulators[]>>(
    `/selectables/regulators`
  );
  return response.data;
};

export const moveRegulatorToTrashFn = async ({ id }: { id: string }) => {
  const response = await privateAuthApi.delete<IResponse<[]>>(
    `/admin/regulators/${id}`
  );
  return response.data;
};
export const restoreRegulatorFn = async ({ id }: { id: string }) => {
  const response = await privateAuthApi.post<IResponse<IRegulators>>(
    `/admin/regulators/${id}/restore`
  );
  return response.data;
};
export const deleteRegulatorFn = async ({ id }: { id: string }) => {
  const response = await privateAuthApi.delete<IResponse<[]>>(
    `/admin/regulators/${id}/delete`
  );
  return response.data;
};
