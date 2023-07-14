import {
  ICreateUpdateControls,
  IControls,
  IControlsFull,
  IResponse,
} from "@/typings";
import { privateAuthApi } from "./axios";

export const createControlsFn = async (domain: ICreateUpdateControls) => {
  const response = await privateAuthApi.post<IResponse<IControls>>(
    `/admin/controls`,
    domain
  );
  return response.data;
};

export const updateControlsFn = async ({
  id,
  controls,
}: {
  id: string;
  controls: ICreateUpdateControls;
}) => {
  const response = await privateAuthApi.put<IResponse<IControls>>(
    `/admin/controls/${id}`,
    controls
  );
  return response.data;
};

export const getControlsFn = async (id: string) => {
  const response = await privateAuthApi.get<IResponse<IControls>>(
    `/admin/controls/${id}`
  );
  return response.data;
};

export const getTrashedControlsCountFn = async () => {
  const response = await privateAuthApi.get<IResponse<number>>(
    `/admin/controls/trashed-count`
  );
  return response.data;
};

export const getAllControlsFn = async () => {
  const response = await privateAuthApi.get<IResponse<IControls>>(
    `/admin/controls`
  );
  return response.data;
};

export const moveControlsToTrashFn = async ({ id }: { id: string }) => {
  const response = await privateAuthApi.delete<IResponse<[]>>(
    `/admin/controls/${id}`
  );
  return response.data;
};
export const restoreControlsFn = async ({ id }: { id: string }) => {
  const response = await privateAuthApi.post<IResponse<IControls>>(
    `/admin/controls/${id}/restore`
  );
  return response.data;
};
export const deleteControlsFn = async ({ id }: { id: string }) => {
  const response = await privateAuthApi.delete<IResponse<[]>>(
    `/admin/controls/${id}/delete`
  );
  return response.data;
};
