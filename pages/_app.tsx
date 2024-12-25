import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Nav from '../components/Navigation';
import Layout from '../layouts/layout';
// import Link from 'next/link';
import Script from 'next/script';
import { useNavigationStore } from '@/store/navigationStore';

export default function App({ Component, pageProps }: AppProps) {
  console.log('NAVER_CLIENT_ID:', process.env.NEXT_PUBLIC_NAVER_CLIENT_ID);

  return (
    <>
      {/* <Component {...pageProps} /> */}
      <Script
        strategy="afterInteractive" //"beforeInteractive"으로 찾았는데 경고메세지 떠가지고 after로 수정해줬습니다.
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}`}
        onLoad={() => {
          console.log('Naver Map Loaded');
          window.dispatchEvent(new Event('naverMapLoaded'));
        }}
      ></Script>
      <Layout>
        <Nav />
        <main style={{ flex: 1 }}>
          <Component {...pageProps} />
        </main>
      </Layout>
    </>
  );
}
