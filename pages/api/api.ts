import axios from 'axios';

const BASE_URL = '/api';
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
    const response = await api.get('/post/pageList', {
      params: { keyword, page: page },
    });
    return response.data;
  },
  // 카페 상세 정보 조회
  getCafeDetail: async (cafeId: number) => {
    const response = await api.get(`/post/getPost`);
    return response.data;
  },

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
};
