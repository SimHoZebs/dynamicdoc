/* eslint-disable @next/next/no-sync-scripts */
import type { AppProps } from "next/app";
import "../lib/globals.css";
import { trpc } from "../lib/util/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <script src="http://localhost:8097"></script>
      <ReactQueryDevtools initialIsOpen={true} />
      <Component {...pageProps} />
    </>
  );
}

export default trpc.withTRPC(MyApp);
