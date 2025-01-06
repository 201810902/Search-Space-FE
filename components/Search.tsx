import style from './Search.module.css';
import React, { useState } from 'react';
import { Cafe } from '../types/cafe';
import { apiService } from '../pages/api/api';
interface SearchProps {
  cafeList: Cafe[];
  onSearchResult: (result: Cafe[]) => void;
}

export default function Search({ cafeList, onSearchResult }: SearchProps) {
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const searchTimer = React.useRef<number>();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchKeyword = e.target.value;
    setKeyword(searchKeyword);
    //검색어 없는 경우 전체 목록 표시
    if (!searchKeyword.trim()) {
      onSearchResult(cafeList);
      return;
    }
    if (searchTimer.current) {
      window.clearTimeout(searchTimer.current);
    }
    searchTimer.current = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        const page = 1;
        const results = await apiService.searchCafes(searchKeyword, page);
        onSearchResult(results);
      } catch (error) {
        console.error('검색 오류:', error);
        onSearchResult([]);
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
