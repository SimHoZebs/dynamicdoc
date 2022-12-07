/* eslint-disable @next/next/no-sync-scripts */
import { StoreProvider } from "easy-peasy";
import type { AppProps } from "next/app";
import "../lib/globals.css";
import globalStates from "../lib/util/globalStates";
import { trpc } from "../lib/util/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider store={globalStates}>
      <script src="http://localhost:8097"></script>
      <ReactQueryDevtools initialIsOpen={true} />
      <Component {...pageProps} />
    </StoreProvider>
  );
}

export default trpc.withTRPC(MyApp);
