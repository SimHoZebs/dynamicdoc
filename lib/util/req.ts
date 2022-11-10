import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";

type methodFunctions = Partial<Record<Method, () => Promise<unknown>>>;
type Params = Partial<Record<Method, unknown>>;
type Data = Partial<Record<Method, unknown>>;

type Handler = {
  methodFunctions: methodFunctions;
  params: Params;
  data: Data;
};

function req<T extends Handler, D extends Method>(config: AxiosRequestConfig<T["params"][D]>) {

  //Nonnullable enforced as method will always exist.
  //I'd like to narrow it out of undefined, but I can't narrow generics.
  type res = Awaited<ReturnType<NonNullable<T["methodFunctions"][D]>>>;

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL + "/api"
  })
    <res,
      AxiosResponse<res>,
      T["params"][D]
    >(
      config
    );
};

export default req;