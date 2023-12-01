import { AppProps } from 'next/app';
import Head from 'next/head';

import './globals.css';
import RootLayout from './layout';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <RootLayout>
      <Head>
        <title>Welcome to AirBnb Host Example!</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </RootLayout>
  );
}

export default CustomApp;
