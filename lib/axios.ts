import axios from "axios";

const getAxiosInstance = ({ BASE_URL }: { BASE_URL: string }) => {
  return {
    async get({
      method,
      params,
      headers,
    }: {
      method: string;
      params: any;
      headers?: Record<string, any>;
    }) {
      return axios.get(`/${method}`, {
        baseURL: BASE_URL,
        headers: headers,
        params,
      });
    },
    async post({
      method,
      data,
      headers,
    }: {
      method: string;
      data: any;
      headers?: Record<string, any>;
    }) {
      return axios.post(`/${method}`, data, {
        baseURL: BASE_URL,
        headers: headers,
      });
    },
  };
};

export { getAxiosInstance };
