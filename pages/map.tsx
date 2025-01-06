import { useState, useEffect, useRef, useCallback, Children } from 'react';
import { api, apiService } from '../pages/api/api';
import styles from './map.module.css';
import open from '../public/lessthan.svg';
import close from '../public/greaterthan.svg';
import Marker from '../components/Marker';
import type { naver } from '../types/naver';
import { useNavigationStore } from '@/store/navigationStore';
import CafePreview from '../components/CafePreview';
import { Cafe } from '@/types/cafe';
import Search from '../components/Search';
declare global {
  interface Window {
    naver: typeof naver;
  }
}

interface CafeData {
  id: number;
  title: string;
  content: string;
  address: string;
  type: string;
  businessHours: string;
  holidays: string;
  url: string;
  latitude: number;
  longitude: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  images: string[];
  phoneNumber: string;
}
// 카페 데이터 로드 함수를 컴포넌트 외부로 분리
const fetchCafesByBounds = async (
  bounds: naver.maps.LatLngBounds,
  userLat: number,
  isOpen: boolean,
) => {
  const ne = bounds.getNE();
  const sw = bounds.getSW();
  const params = {
    userLocation: [userLat] as [number],
    topLeftLat: ne.lat(),
    topLeftLng: sw.lng(),
    bottomRightLat: sw.lat(),
    bottomRightLng: ne.lng(),
    limit: 20,
    postType: 'CAFE' as 'CAFE',
    isOpen: isOpen,
    orderBy: 'DISTANCE' as 'DISTANCE',
  };
  console.log('API 요청 파라미터:', params);
  try {
    const data = await apiService.getCafes(params);

    return data;
  } catch (err) {
    console.error('카페 정보 로드 실패:', err);
    return [];
  }
};

export default function Map() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isCafeOnly, setIsCafeOnly] = useState(false);
  const [isOpenOnly, setIsOpenOnly] = useState(false);
  const [cafeData, setCafeData] = useState<CafeData[]>([]);
  const { activeMenu } = useNavigationStore();
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [infowindow, setInfowindow] = useState<naver.maps.InfoWindow | null>(
    null,
  );
  const [cafeList, setCafeList] = useState<Cafe[]>([]);
  const [filteredCafeList, setFilteredCafeList] = useState<Cafe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearchResult = (result: Cafe[]) => {
    setFilteredCafeList(result);
  };

  // 지도 이동 및 초기 로드시 카페 데이터 업데이트
  useEffect(() => {
    const updateCafeData = async () => {
      if (!mapRef.current || !userLocation) return;
      const bounds = mapRef.current.getBounds();
      if (!bounds) return;

      setIsLoading(true);
      try {
        const data = await fetchCafesByBounds(
          bounds,
          userLocation.lat,
          isOpenOnly,
        );
        setCafeData(data);
        setFilteredCafeList(data);
      } catch (err) {
        setError('카페 정보를 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    // let listener: naver.maps.MapEventListener | null = null;
    let listener: any = null;

    if (mapRef.current && window.naver?.maps) {
      // 이벤트 리스너 등록 시 반환값 저장
      listener = window.naver.maps.Event.addListener(
        mapRef.current,
        'idle',
        updateCafeData,
      );
    }

    // cleanup 함수
    return () => {
      if (listener) {
        window.naver?.maps?.Event.removeListener(listener);
      }
    };
  }, [userLocation, isOpenOnly]);
  // useEffect(() => {
  //   const updateCafeData = async () => {
  //     if (!mapRef.current || !userLocation) return;

  //     const bounds = mapRef.current.getBounds();
  //     if (!bounds) return;

  //     setIsLoading(true);
  //     try {
  //       const data = await fetchCafesByBounds(
  //         bounds,
  //         userLocation.lat,
  //         isOpenOnly,
  //       );
  //       setCafeData(data);
  //       setFilteredCafeList(data);
  //     } catch (err) {
  //       setError('카페 정보를 불러오는데 실패했습니다.');
  //       console.error(err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   // 초기 데이터 로드
  //   updateCafeData();

  //   // 지도 이동 이벤트 리스너
  //   if (mapRef.current && window.naver?.maps) {
  //     window.naver.maps.Event.addListener(
  //       mapRef.current,
  //       'idle',
  //       updateCafeData,
  //     );
  //   }

  //   return () => {
  //     if (mapRef.current && window.naver?.maps) {
  //       window.naver.maps.Event.removeListener(
  //         mapRef.current,
  //         'idle',
  //         updateCafeData,
  //       );
  //     }
  //   };
  // }, [isOpenOnly]);

  //마커 클릭시 열리는 정보창
  useEffect(() => {
    if (window.naver && window.naver.maps) {
      const infoWindow = new window.naver.maps.InfoWindow({
        content: '',
        maxWidth: 300,
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        anchorSize: new window.naver.maps.Size(10, 10),
        anchorSkew: true,
        pixelOffset: new window.naver.maps.Point(0, -5),
        disableAnchor: false,
      });
      setInfowindow(infoWindow);
    }
  }, []);

  const handleClosePreview = () => {
    setSelectedCafe(null);
  };

  const handlePanelOpen = () => {
    setIsPanelOpen(!isPanelOpen);
  };
  const mapRef = useRef<any>(null);

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
  const handleMarkerClick = (marker: naver.maps.Marker) => {
    console.log('마커가 클릭됨', marker);

    if (!mapRef.current || !infowindow) return;
    // console.log('마커가 클릭됨. 선택된 카페:', cafe);

    // 현재 마커의 위치 가져오기
    const position = marker.getPosition();
    const clickedCafe = cafeData.find(
      cafe =>
        Math.abs(cafe.latitude - position.lat()) < 0.0001 &&
        Math.abs(cafe.longitude - position.lng()) < 0.0001,
    );

    if (!clickedCafe) {
      console.error('카페 데이터를 찾을 수 없습니다');
      return;
    }

    console.log('마커가 클릭됨. 선택된 카페:', clickedCafe);

    // 기존 infowindow가 열려있다면 닫기
    if (infowindow.getMap()) {
      infowindow.close();
    }

    // InfoWindow 컨텐츠 설정
    const content = `
      <div style="padding: 15px; max-width: 300px; background: white;">
        <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">${clickedCafe.title}</h3>
        <p style="margin: 5px 0; font-size: 13px; color: #666;">${clickedCafe.address}</p>
        ${
          clickedCafe.images?.[0]
            ? `
          <div style="margin: 10px 0;">
            <img src="${clickedCafe.images[0]}" 
                alt="${clickedCafe.title}" 
                style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px;"
            />
          </div>
        `
            : ''
        }
        <p style="margin: 5px 0; font-size: 13px; color: #666;">${clickedCafe.phoneNumber || ''}</p>
      </div>
    `;

    // InfoWindow 설정 및 열기
    infowindow.setContent(content);
    infowindow.open(mapRef.current, marker);
  };

  const renderSidePanel = () => {
    return (
      <div className={styles.sidePanelContent}>
        <Search cafeList={cafeList} onSearchResult={handleSearchResult} />
        {activeMenu === 'map' && (
          <div className={styles.resultList}>
            {filteredCafeList.map(cafe => (
              <div
                key={cafe.id}
                className={styles.cafeItem}
                onClick={() => {
                  if (mapRef.current) {
                    const position = new window.naver.maps.LatLng(
                      cafe.latitude,
                      cafe.longitude,
                    );
                    mapRef.current.setCenter(position);
                    mapRef.current.setZoom(14);

                    const markers = mapRef.current.markers || [];
                    const marker = markers.find((m: naver.maps.Marker) => {
                      const pos = m.getPosition();
                      return (
                        Math.abs(pos.lat() - cafe.latitude) < 0.0001 &&
                        Math.abs(pos.lng() - cafe.longitude) < 0.0001
                      );
                    });
                    if (marker) {
                      handleMarkerClick(marker);
                    }
                  }
                }}
              >
                <h3>{cafe.title}</h3>
                <p>{cafe.address}</p>
              </div>
            ))}
          </div>
        )}
        {activeMenu === 'favorite' && (
          <div className={styles.sidePanelContent}>리스트</div>
        )}
      </div>
    );
  };
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
          <div className={styles.sidePanelContent}>{renderSidePanel()}</div>
        </div>
        <button
          onClick={handlePanelOpen}
          className={isPanelOpen ? styles.panelCloseBtn : styles.panelOpenBtn}
        ></button>
      </div>
      <div className={styles.mapContainer} style={{ zIndex: 900 }}>
        <div id="map" className={styles.map} ref={mapRef} />

        {/* 카페 마커 렌더링 */}
        {mapRef.current &&
          window.naver?.maps &&
          cafeData.map(cafe => (
            <Marker
              key={cafe.id}
              map={mapRef.current}
              position={{
                lat: cafe.latitude,
                lng: cafe.longitude,
              }}
              icon={{
                url: '/cafemarker.svg',
                size: new window.naver.maps.Size(37, 37),
                origin: new window.naver.maps.Point(0, 0),
                anchor: new window.naver.maps.Point(18, 37),
              }}
              onClick={marker => handleMarkerClick(marker)}
            />
          ))}
        {selectedCafe && (
          <CafePreview cafe={selectedCafe} onClose={handleClosePreview} />
        )}
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
    </div>
  );
}
