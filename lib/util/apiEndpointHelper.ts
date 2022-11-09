import { NextApiRequest } from "next";

export default async function apiEndpointHelper<T extends { [key: string]: () => Promise<any>; }>(
  req: NextApiRequest,
  methodFunctions: T
) {

  const { method } = req;

  let validMethod;
  try {
    if (method && method in methodFunctions) {
      validMethod = method as keyof T;
    } else {
      throw new Error(`Method ${method} is not recognized. Please use one of the following: ${Object.keys(methodFunctions).join(", ")}`);
    }
  }
  catch (error) {
    return { status: 404, response: error };
  }

  try {
    const response = await methodFunctions[validMethod]();
    return { status: 200, response };
  }
  catch (error) {
    return { status: 500, response: error };
  }
}