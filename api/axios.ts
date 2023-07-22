import axios from "axios";
import Cookies from "js-cookie";
export const BASE_URL = "https://lets-comply-backend.auguma.io";

export const authApi = axios.create({
  baseURL: BASE_URL,
});

authApi.defaults.headers.common["Content-Type"] = "application/json";

export const privateAuthApi = axios.create({
  baseURL: BASE_URL,
});

privateAuthApi.defaults.headers.common["Content-Type"] = "application/json";

/////////
privateAuthApi.interceptors.request.use(
  (config) => {
    if (config.headers?.Authorization === undefined) {
      const accessToken = Cookies.get("AT");

      if (accessToken) {
        const jwt = `Bearer ${accessToken}`;
        config.headers!.Authorization = jwt;
      }
    }
    return config;
  },
  (err) => Promise.reject(err)
);

privateAuthApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const errStatus = error?.response?.status;

    if (errStatus === 401) {
      document.location.href = "/";
    }
    return Promise.reject(error);
  }
);
