import { Method } from "axios";

type MethodFunction = () => Promise<unknown>;

export default async function apiEndpointHelper<T extends Partial<Record<Method, MethodFunction>>>(
  method: string | undefined,
  methodFunctions: T
) {
  let validMethod;
  try {
    if (method && Object.keys(methodFunctions).includes(method.toLowerCase())) {
      validMethod = method.toLowerCase() as Lowercase<Method>;
    } else {
      throw new Error(`Method ${method} is not recognized. Please use one of the following: ${Object.keys(methodFunctions).join(", ")}`);
    }
  }
  catch (error) {
    console.log(error);
    return { status: 404, response: error };
  }

  try {
    const methodFunction = methodFunctions[validMethod] as MethodFunction;

    const response = await methodFunction();
    return { status: 200, response };
  }
  catch (error) {
    console.log(error);
    return { status: 500, response: error instanceof Error ? error.message : error };
  }
}