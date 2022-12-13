/* eslint-disable @next/next/no-sync-scripts */
import type { AppProps } from "next/app";
import "../lib/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <script src="http://localhost:8097"></script>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
