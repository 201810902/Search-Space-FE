import { useEffect, useRef } from 'react';
import type { naver } from '../types/naver';
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

  useEffect(() => {
    const initMarker = () => {
      if (!window.naver) return;

      // 마커 생성
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(position.lat, position.lng),
        map: map,
        icon: icon && {
          url: icon.url,
          size: icon.size || new window.naver.maps.Size(24, 37),
          origin: icon.origin || new window.naver.maps.Point(0, 0),
          anchor: icon.anchor || new window.naver.maps.Point(12, 37),
        },
      });

      // 클릭 이벤트 설정
      if (onClick) {
        window.naver.maps.Event.addListener(marker, 'click', onClick);
      }

      markerRef.current = marker;
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
        if (onClick) {
          window.naver.maps.Event.removeListener(
            markerRef.current,
            'click',
            onClick,
          );
        }
      }
    };
  }, [map, position, icon, onClick]);

  return null;
};

export default NaverMarker;
