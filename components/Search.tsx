import style from './Search.module.css';
import React, { useState } from 'react';
import { Cafe } from '../types/cafe';
import { apiService } from '../pages/api/api';
interface SearchProps {
  cafeList: Cafe[];
  onSearchResult: (result: Cafe[], keyword: string) => void;
  bounds: {
    userLocation: [number, number];
    topLeftLat: number;
    topLeftLng: number;
    bottomRightLat: number;
    bottomRightLng: number;
  };
}

export default function Search({
  cafeList,
  onSearchResult,
  bounds,
}: SearchProps) {
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const searchTimer = React.useRef<number>();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchKeyword = e.target.value;
    setKeyword(searchKeyword);
    //검색어 없는 경우 전체 목록 표시
    if (!searchKeyword.trim()) {
      onSearchResult(cafeList, searchKeyword);
      return;
    }
    if (searchTimer.current) {
      window.clearTimeout(searchTimer.current);
    }
    searchTimer.current = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        const params = {
          ...bounds,
          userLocation: [bounds.userLocation[0], bounds.userLocation[1]] as [
            number,
            number,
          ],
          postId: 0,
          limit: 20,
          keyword: searchKeyword,
          postType: 'CAFE' as 'CAFE',
          isOpen: false,
          orderBy: 'DISTANCE' as 'DISTANCE',
        };
        const results = await apiService.searchCafes(searchKeyword, params);
        onSearchResult(results, searchKeyword);
      } catch (error) {
        console.error('검색 오류:', error);
        onSearchResult([], searchKeyword);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };
  return (
    <div>
      <input
        type="text"
        value={keyword}
        onChange={handleSearch}
        placeholder="카페 이름으로 검색"
        className={style.searchInput}
        disabled={isLoading}
      />
      {isLoading && <span className={style.loadingIndicator}>검색중...</span>}
    </div>
  );
}
