import { useState, useEffect, useRef, useCallback, Children } from 'react';
import styles from './map.module.css';
import open from '../public/lessthan.svg';
import close from '../public/greaterthan.svg';
import Marker from '../components/Marker';
import type { naver } from '../types/naver';
declare global {
  interface Window {
    naver: typeof naver;
  }
}

export default function Map() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isCafeOnly, setIsCafeOnly] = useState(false);
  const [isOpenOnly, setIsOpenOnly] = useState(false);
  const handlePanelOpen = () => {
    setIsPanelOpen(!isPanelOpen);
  };
  const mapRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  //@화면의 4방향 좌표값 백엔드에 전송
  useEffect(() => {
    if (userLocation && mapRef.current) {
      const bounds = mapRef.current.getBounds();
      if (bounds) {
        const northEast = bounds.getNE();
        const southWest = bounds.getSW();
        const center = bounds.getCenter();
        const coordinates = {
          userLocation: userLocation,
          topLeft: { lat: northEast.lat(), lng: southWest.lng() },
          topRight: { lat: northEast.lat(), lng: northEast.lng() },
          bottomLeft: { lat: southWest.lat(), lng: southWest.lng() },
          bottomRight: { lat: southWest.lat(), lng: northEast.lng() },
          center: { lat: center.lat(), lng: center.lng() },
        };
        console.log('Coordinates to send to backend:', coordinates);
      }
    }
  }, [userLocation]);

  useEffect(() => {
    const initMap = (latitude: number, longitude: number) => {
      if (!window.naver || !window.naver.maps) return;

      const mapOptions = {
        center: new window.naver.maps.LatLng(latitude, longitude),
        zoom: 14,
        tileTransition: false,
        loadingDisplay: false,
        bounds: new window.naver.maps.LatLngBounds(
          new window.naver.maps.LatLng(latitude - 0.02, longitude - 0.02),
          new window.naver.maps.LatLng(latitude + 0.02, longitude + 0.02),
        ),
        //타일 로딩 최적화
        maxZoom: 20,
        minZoom: 10,
        scaleControl: false,
        mapDataControl: false,
        tileSize: new window.naver.maps.Size(256, 256),
      };

      mapRef.current = new window.naver.maps.Map('map', mapOptions);
      //초기 로드시 호출

      let isMoving = false;
      let lastLocation: { lat: number; lng: number } | null = null;

      //#지도 이동 이벤트
      window.naver.maps.Event.addListener(
        mapRef.current,
        'bounds_changed',
        () => {
          isMoving = true;
          const newBounds = mapRef.current.getBounds();
          const newCenter = newBounds.getCenter();
          lastLocation = {
            lat: newCenter.lat(),
            lng: newCenter.lng(),
          };
        },
      );

      //지도 이동 중에 사용자 위치가 변경되면 업데이트
      window.naver.maps.Event.addListener(mapRef.current, 'idle', () => {
        if (isMoving && lastLocation) {
          if (
            !userLocation ||
            userLocation.lat !== lastLocation.lat ||
            userLocation.lng !== lastLocation.lng
          ) {
            setUserLocation(lastLocation);
          }
          isMoving = false;
        }
      });
      window.naver.maps.Event.addListener(mapRef.current, 'idle', () => {
        isMoving = false;
      });
    };

    const loadMapScript = () => {
      const mapScript = document.createElement('script');
      mapScript.onload = () => {
        getUserLocation();
      };
      mapScript.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}`;
      document.head.appendChild(mapScript);
    };
    //# 사용자 위치 경도, 위도값
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            setUserLocation({ lat: latitude, lng: longitude }); // 사용자의 위치 저장
            console.log('사용자 위치 정보 업데이트 완료', {
              lat: latitude,
              lng: longitude,
            });
            // setUserLocation이 완료된 후 initMap 호출
            initMap(latitude, longitude);
            // sendBoundsToBackend();
          },
          (error) => {
            console.error('Geolocation error: ', error);
            // 기본 위치로 초기화
            initMap(37.3595704, 127.105399);
          },
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        initMap(37.3595704, 127.105399);
      }
    };

    if (window.naver && window.naver.maps) {
      //Naver Maps APi가 이미 로드된 경우
      getUserLocation();
    } else {
      loadMapScript(); //naver maps api 로드
    }
  }, []); //의존성배열 userLocation 넣으면 무한로딩문제발생함;

  const handleCafeOnly = () => {
    setIsCafeOnly(!isCafeOnly);
  };
  const handleOpenOnly = () => {
    setIsOpenOnly(!isOpenOnly);
  };
  const zoomIn = () => {
    //지도 확대
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() + 1);
    }
  };

  const zoomOut = () => {
    //지도 축소
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() - 1);
    }
  };
  //@현재 접속위치로 재이동
  const moveCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          // 사용자의 현재 위치로 지도 중심 이동
          mapRef.current.setCenter(
            new window.naver.maps.LatLng(latitude, longitude),
          );
          setUserLocation({ lat: latitude, lng: longitude }); // 사용자의 위치 업데이트
        },
        (error) => {
          console.error('Geolocation error: ', error);
        },
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };
  //   if (window.naver && window.naver.maps) {
  //     initMap();
  //   } else {
  //     const mapScript = document.createElement('script');
  //     mapScript.onload = () => initMap();
  //     mapScript.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}`;
  //     document.head.appendChild(mapScript);
  //   }
  // }, []);
  // const zoomIn = () => {
  //   if (mapRef.current)
  // }
  return (
    <div className={styles.container}>
      <div
        id="map"
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          willChange: 'transform', // 성능 최적화를 위한 속성,
        }}
      />

      <div className={styles.sidePanelContainer}>
        <div
          className={`${styles.sidePanel} ${!isPanelOpen ? styles.sidePanelClosed : ''}`}
        >
          <div className={styles.sidePanelContent}></div>
        </div>
        <button
          onClick={handlePanelOpen}
          className={isPanelOpen ? styles.panelCloseBtn : styles.panelOpenBtn}
        ></button>
      </div>
      <div className={styles.mapfilterGroup}>
        <button
          className={isCafeOnly ? styles.activeFilter : styles.unactiveFilter}
          onClick={handleCafeOnly}
        >
          카페
        </button>
        <button
          className={isOpenOnly ? styles.activeFilter : styles.unactiveFilter}
          onClick={handleOpenOnly}
        >
          운영중
        </button>
      </div>
      {/* 버튼그룹 */}
      <div className={styles.buttonContainer}>
        <div className={styles.zoomBtnContainer}>
          <button onClick={zoomIn} className={styles.zoomInBtn}></button>
          <button onClick={zoomOut} className={styles.zoomOutBtn}></button>
        </div>
        <button
          onClick={moveCurrentLocation}
          className={styles.currentLocationBtn}
        ></button>
      </div>
    </div>
  );
}
