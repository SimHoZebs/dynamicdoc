import type { AppProps } from "next/app";
import "../lib/globals.css";
import { trpc } from "../lib/util/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ReactQueryDevtools initialIsOpen={false} />
      <Component {...pageProps} />
    </>
  );
}

export default trpc.withTRPC(MyApp);
