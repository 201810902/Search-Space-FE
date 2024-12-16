import { useEffect, useRef } from 'react';
import type { naver } from '../types/naver';
import styles from './Marker.module.css';
declare global {
  interface Window {
    naver: typeof naver;
  }
}
interface MarkerProps {
  map: naver.maps.Map;
  position: {
    lat: number;
    lng: number;
  };
  icon?: {
    url: string;
    size?: naver.maps.Size;
    origin?: naver.maps.Point;
    anchor?: naver.maps.Point;
  };
  onClick?: () => void;
}

const NaverMarker = ({ map, position, icon, onClick }: MarkerProps) => {
  const markerRef = useRef<naver.maps.Marker | null>(null);
  const listenerRef = useRef<any>(null);

  useEffect(() => {
    const initMarker = () => {
      if (!window.naver) {
        console.error('네이버 api 아직 로딩되지 않음');
        return;
      }
      try {
        console.log('마커 생성 시도:', {
          position,
          icon,
        });

        // const markerOptions = {
        //   position: new window.naver.maps.LatLng(position.lat, position.lng),
        //   map: map,
        //   icon: {
        //     url: icon.url,
        //     size: icon.size,
        //     origin: icon.origin,
        //     anchor: icon.anchor,
        //     scaledSize: new window.naver.maps.Size(37, 37),
        //   },
        // };
        // console.log('마커 위치', position);

        // 마커 생성
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(position.lat, position.lng),
          map: map,
          icon: icon && {
            url: icon.url,
            size: icon.size || new window.naver.maps.Size(32, 32),
            origin: icon.origin || new window.naver.maps.Point(0, 0),
            anchor: icon.anchor || new window.naver.maps.Point(16, 16),
          },
        });
        console.log('show marker!', marker);

        // 클릭 이벤트 설정
        if (onClick) {
          listenerRef.current = window.naver.maps.Event.addListener(
            marker,
            'click',
            onClick,
          );
        }

        markerRef.current = marker;
      } catch (error) {
        console.error('마커 생성 중 오류:', error);
      }
    };

    // 네이버 맵이 이미 로드되어 있는 경우
    if (window.naver && window.naver.maps) {
      initMarker();
    } else {
      // 네이버 맵 로드 완료 이벤트 리스너
      const onLoadMap = () => initMarker();
      window.addEventListener('naverMapsLoaded', onLoadMap);
      return () => {
        window.removeEventListener('naverMapsLoaded', onLoadMap);
      };
    }

    // 컴포넌트 언마운트 시 마커 제거
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        if (listenerRef.current) {
          window.naver.maps.Event.removeListener(listenerRef.current);
        }
      }
    };
  }, [map, position, icon, onClick]);

  return null;
};

export default NaverMarker;
