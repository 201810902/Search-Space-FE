import style from './Navigation.module.css';
import Link from 'next/link';
import Image from 'next/image';
import mypage from '../public/mypage-logo.svg';
import MainLogo from '../public/kr_logo.svg';
import Map from '../public/map.svg';
import Map_active from '../public/map_active.svg';
import AddSpace from '../public/addSpace.svg';
import AddSpace_active from '@/public/addSpace_active.svg';
import Scrap from '../public/scrap.svg';
import Scrap_active from '../public/scrap_active.svg';
import { useNavigationStore } from '@/store/navigationStore';
import Search from '../public/search.svg';
import Search_active from '../public/search_active.svg';
import { useState } from 'react';

const Navigation = () => {
  const [activeLink, setActiveLink] = useState('');
  const { activeMenu, setActiveMenu } = useNavigationStore();

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
    setActiveMenu(link);
    console.log('nav 상태 테스트', activeMenu, activeLink);
  };
  return (
    <>
      <div className={style.container}>
        <nav className={style.nav}>
          <Link
            href="/"
            className={`${style.link} ${activeLink === '/' ? style.active : ''}`}
            onClick={() => handleLinkClick('/')}
          >
            <Image src={MainLogo} alt="홈페이지 메뉴" width={50} height={50} />
          </Link>
          <Link
            href="/map"
            className={`${style.link} ${activeLink === '/map' ? style.active : ''}`}
            onClick={() => handleLinkClick('/map')}
          >
            <Image
              src={activeLink === '/map' ? Map_active : Map}
              alt="지도 보기 메뉴"
              width={30}
              height={30}
            />
            <span className={style.span}>지도보기</span>
          </Link>
          <Link
            href="/Search"
            className={`${style.link} ${activeLink === '/Search' ? style.active : ''}`}
            onClick={() => handleLinkClick('/Search')}
          >
            <Image
              src={activeLink === '/Search' ? Search_active : Search}
              alt="공간 탐색 보기 메뉴"
              width={45}
              height={40}
            />
            <span className={style.span}>공간 탐색</span>
          </Link>
          <Link
            href="/favorite"
            className={`${style.link} ${activeLink === '/favorite' ? style.active : ''}`}
            onClick={() => handleLinkClick('/favorite')}
          >
            <Image
              src={activeLink === '/favorite' ? Scrap_active : Scrap}
              alt="찜한공간 보기 메뉴"
              width={30}
              height={30}
            />
            <span className={style.span}>찜한 공간</span>
          </Link>
          <Link
            href="/addspace"
            className={`${style.link} ${activeLink === '/addspace' ? style.active : ''}`}
            onClick={() => handleLinkClick('/addspace')}
          >
            <Image
              src={activeLink === '/addspace' ? AddSpace_active : AddSpace}
              alt="공간등록 페이지 메뉴"
              width={30}
              height={30}
            />
            <span className={style.span}>공간 등록</span>
          </Link>
          <Link
            href="/mypage"
            className={`${style.link} ${activeLink === '/mypage' ? style.active : ''}`}
            onClick={() => handleLinkClick('/mypage')}
          >
            <Image src={mypage} alt="마이페이지 메뉴" width={30} height={30} />
            <span className={style.span}>마이페이지</span>
          </Link>
        </nav>
      </div>
    </>
  );
};
export default Navigation;
