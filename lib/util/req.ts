import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

type Handler = (res: NextApiRequest, req: NextApiResponse) => Promise<{
  methodFunctions: Partial<Record<Method, () => Promise<unknown>>>;
  params: Partial<Record<string, unknown>>;
  data: Partial<Record<string, unknown>>;
}>;

type AwaitedReturn<T extends (...args: any[]) => Promise<unknown>> = Awaited<ReturnType<T>>;

interface Config<T extends Handler> extends AxiosRequestConfig<AwaitedReturn<T>["data"]> {
  params?: AwaitedReturn<T>["params"];
};

function req<T extends Handler, D extends Lowercase<Method>>(config: Config<T>) {

  //Nonnullable enforced as method will always exist.
  //I'd like to narrow it out of undefined, but I can't narrow generics.
  type Res = AwaitedReturn<NonNullable<AwaitedReturn<T>["methodFunctions"][D]>>;

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL + "/api/"
  })
    <Res,
      AxiosResponse<Res>,
      AwaitedReturn<T>["data"]
    >(
      config
    );
};

export default req;