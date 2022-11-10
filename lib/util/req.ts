import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";

type Handler = {
  methodFunctions: Partial<Record<Method, () => Promise<unknown>>>;
  params: Partial<Record<Method, unknown>>;
  data: Partial<Record<Method, unknown>>;
};

function req<T extends Handler, D extends Method>(config: AxiosRequestConfig<{ [key: string]: T["data"][D]; }>) {

  //Nonnullable enforced as method will always exist.
  //I'd like to narrow it out of undefined, but I can't narrow generics.
  type res = Awaited<ReturnType<NonNullable<T["methodFunctions"][D]>>>;

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL + "/api/"
  })
    <res,
      AxiosResponse<res>,
      { [key: string]: T["data"][D]; }
    >(
      config
    );
};

export default req;