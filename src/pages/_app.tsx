import type { AppProps } from "next/app";
import "../lib/globals.css";
import { trpc } from "../lib/util/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex h-screen w-screen bg-dark-900 text-gray-200">
      <ReactQueryDevtools initialIsOpen={false} />
      <Component {...pageProps} />
    </div>
  );
}

export default trpc.withTRPC(MyApp);
