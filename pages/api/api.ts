import axios from 'axios';

const BASE_URL = 'https://searchspaces.store';
//임시 프록시설정
// process.env.NEXT_PUBLIC_API_URL || 'https://searchspaces.store';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // 카페 목록 조회
  getCafes: async (params: {
    userLocation: [number];
    topLeftLat: number;
    topLeftLng: number;
    bottomRightLat: number;
    bottomRightLng: number;
    postId?: number;
    limit?: number;
    keyword?: string;
    postType?: 'CAFE';
    isOpen?: boolean;
    orderBy?: 'DISTANCE';
  }) => {
    const response = await api.get('/post/cursorList', {
      params: {
        ...params,
        postType: 'CAFE', // 기본값 설정
        orderBy: 'DISTANCE', // 기본값 설정
      },
    });
    return response.data;
  },

  // // 특정 지역의 카페 조회 (지도 범위 내)
  // getCafesByLocation: async (bounds: {
  //   north: number;
  //   south: number;
  //   east: number;
  //   west: number;
  // }) => {
  //   const response = await api.get('/api/cafes/location', {
  //     params: bounds,
  //   });
  //   return response.data;
  // },

  // 카페 검색
  searchCafes: async (keyword: string, page: number = 1) => {
    try {
      const response = await api.get('/post/pageList', {
        params: { keyword, page: page },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('=== API 에러 상세 정보 ===');
        console.error('에러 메시지:', error.message);
        console.error('요청 URL:', error.config?.url);
        console.error('요청 메소드:', error.config?.method);
        console.error('요청 파라미터:', error.config?.params);
        console.error('응답 상태:', error.response?.status);
        console.error('응답 데이터:', error.response?.data);
        console.error('헤더:', error.config?.headers);
        console.error('전체 설정:', error.config);

        if (error.response) {
          // 서버가 응답을 반환한 경우 (에러 상태 코드)
          console.error('서버 응답 에러:', {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers,
          });
        } else if (error.request) {
          // 요청은 보냈지만 응답을 받지 못한 경우
          console.error('응답 없음:', error.request);
        } else {
          // 요청 설정 중에 에러가 발생한 경우
          console.error('요청 설정 에러:', error.message);
        }
      } else {
        // AxiosError가 아닌 일반 에러의 경우
        console.error('일반 에러:', error);
      }
      throw error;
    }
    // // 카페 상세 정보 조회
    // getCafeDetail: async (cafeId: number) => {
    //   const response = await api.get(`/post/getPost`);
    //   return response.data;
    // },

    // // 찜하기
    // toggleFavorite: async (cafeId: number) => {
    //   const response = await api.post(`/api/cafes/${cafeId}/favorite`);
    //   return response.data;
    // },

    // // 찜한 카페 목록 조회
    // getFavorites: async () => {
    //   const response = await api.get('/api/cafes/favorites');
    //   return response.data;
    // },
  },
};
