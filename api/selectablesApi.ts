import { IResponse } from "@/typings";
import { privateAuthApi } from "./axios";

export const getModelsFn = async () => {
  const response = await privateAuthApi.get<IResponse<string[]>>(
    `/selectables/log-models`
  );
  return response.data;
};
