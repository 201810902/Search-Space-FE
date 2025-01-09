import axios from 'axios';

const BASE_URL = '/api';

// 기본 axios 인스턴스 생성
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,  // credentials 설정만 유지
});

export const apiService = {
  // 카페 목록 조회
  getCafes: async (params: {
    userLocation: [number, number];
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
        postType: 'CAFE',
        orderBy: 'DISTANCE',
      },
    });
    return response.data;
  },

  // 카페 검색
  searchCafes: async (
    keyword: string,
    params: {
      userLocation: [number, number];
      topLeftLat: number;
      topLeftLng: number;
      bottomRightLat: number;
      bottomRightLng: number;
      postId?: number;
      limit?: number;
      postType?: 'CAFE';
      isOpen?: boolean;
      orderBy?: 'DISTANCE';
    },
  ) => {
    try {
      // userLocation을 문자열로 변환
      const apiParams = {
        ...params,
        userLocation: params.userLocation.join(','),
        postType: 'CAFE',
        orderBy: 'DISTANCE'
      };

      // URL 경로 수정
      const response = await api.get('/post/cursorList', {
        params: apiParams
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('요청 파라미터:', error.config?.params);
        console.error('응답 데이터:', error.response?.data);

        if (error.response) {
          console.error('서버 응답 에러:', {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers,
          });
        } else if (error.request) {
          console.error('응답 없음:', error.request);
        } else {
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
