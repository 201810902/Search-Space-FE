import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './map.module.css';
import open from '../public/lessthan.svg';
import close from '../public/greaterthan.svg';
declare global {
  interface Window {
    naver: any;
  }
}

export default function Map() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
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
  // const sendBoundsToBackend = useCallback(() => {
  //   if (mapRef.current && userLocation) {
  //     const bounds = mapRef.current.getBounds();
  //     if (bounds) {
  //       const northEast = bounds.getNE();
  //       const southWest = bounds.getSW();
  //       const center = bounds.getCenter();
  //       const coordinates = {
  //         userLocation: userLocation, //사용자 접속위치
  //         topLeft: { lat: northEast.lat(), lng: southWest.lng() }, // 맨 왼쪽 위
  //         topRight: { lat: northEast.lat(), lng: northEast.lng() }, // 맨 오른쪽 위
  //         bottomLeft: { lat: southWest.lat(), lng: southWest.lng() }, // 맨 왼쪽 아래
  //         bottomRight: { lat: southWest.lat(), lng: northEast.lng() }, // 맨 오른쪽 아래
  //         center: { lat: center.lat(), lng: center.lng() }, //가운데
  //       };
  //       console.log('Coordinates to send to backend:', coordinates);
  //     } else {
  //       console.error('Bounds is undefined or invalid');
  //     }
  //   }
  // }, [userLocation]);

  useEffect(() => {
    const initMap = (latitude: number, longitude: number) => {
      const mapOptions = {
        center: new window.naver.maps.LatLng(latitude, longitude),
        zoom: 14,
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
          position => {
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
          error => {
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
        position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          // 사용자의 현재 위치로 지도 중심 이동
          mapRef.current.setCenter(
            new window.naver.maps.LatLng(latitude, longitude),
          );
          setUserLocation({ lat: latitude, lng: longitude }); // 사용자의 위치 업데이트
        },
        error => {
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
      <div id="map" style={{ width: '100%', height: '100%' }} ref={mapRef} />
      <div className={styles.sidePanelContainer}>
        <div
          className={`${styles.sidePanel} ${!isPanelOpen ? styles.sidePanelClosed : ''}`}
        >
          사이드패널
        </div>
        <button
          onClick={handlePanelOpen}
          className={isPanelOpen ? styles.panelOpenBtn : styles.panelCloseBtn}
        >
          {/* <Image
            src={navopen ? close : open}
            alt="메뉴 열기"
            width={30}
            height={30}
          /> */}
        </button>
      </div>
      {/* 버튼그룹 */}
      <div className={styles.buttonContainer}>
        <button onClick={zoomIn}>확대</button>
        <button onClick={zoomOut}>축소</button>
        <button onClick={moveCurrentLocation}>현위치</button>
      </div>
    </div>
  );
}
