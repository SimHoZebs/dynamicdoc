import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";

type Endpoint = {
  handler: (...args: any[]) => Promise<Partial<Record<Method, () => Promise<unknown>>>>;
  params: Partial<Record<string, unknown>>;
  data: Partial<Record<string, unknown>>;
};

type AwaitedReturn<T extends (...args: any[]) => Promise<unknown>> = Awaited<ReturnType<T>>;

interface Config<T extends Endpoint> extends AxiosRequestConfig<T["data"]> {
  params?: T["params"];
};

function req<T extends Endpoint, D extends Lowercase<Method>>(config: Config<T>) {

  //Nonnullable enforced as method will always exist.
  //I'd like to narrow it out of undefined, but I can't narrow generics.
  type Res = AwaitedReturn<NonNullable<AwaitedReturn<T["handler"]>[D]>>;

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL + "/api/"
  })
    <Res,
      AxiosResponse<Res>,
      T["data"]
    >(
      config
    );
};

export default req;