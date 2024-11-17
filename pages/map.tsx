import { useEffect } from 'react';
import Script from 'next/script';
import styles from './map.module.css';

declare global {
  interface Window {
    naver: any;
  }
}
export default function Map() {
  useEffect(() => {
    const initMap = () => {
      const mapOptions = {
        center: new window.naver.maps.LatLng(37.3595704, 127.105399),
        zoom: 10,
      };

      new window.naver.maps.Map('map', mapOptions);
    };

    if (window.naver && window.naver.maps) {
      initMap();
    } else {
      const mapScript = document.createElement('script');
      mapScript.onload = () => initMap();
      mapScript.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}`;
      document.head.appendChild(mapScript);
    }
  }, []);
  return (
    <div className={styles.container}>
      <div id="map" style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
}
