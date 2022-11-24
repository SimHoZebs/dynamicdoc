import { StoreProvider } from "easy-peasy";
import type { AppProps } from "next/app";
import "../lib/globals.css";
import globalStates from "../lib/util/globalStates";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider store={globalStates}>
      <Component {...pageProps} />
    </StoreProvider>
  );
}

export default MyApp;
