import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

function req<T = unknown, D = any>(config: AxiosRequestConfig<D>) {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL + "/api"
  })<T, AxiosResponse<T>, D>(

    config

  );
};

export default req;