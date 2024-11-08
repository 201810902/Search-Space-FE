import style from './Navigation.module.css';
import Link from 'next/link';
import Image from 'next/image';
import mypage from '../public/mypage-logo.svg';
import MainLogo from '../public/logo1.svg';
import Map from '../public/map.svg';
import Add from '../public/add-space.svg';
import Scrap from '../public/scrap-icon.svg';

const Navigation = () => {
  return (
    <>
      <nav className={style.nav}>
        <Link href="/" className={style.link}>
          <Image src={MainLogo} alt="홈페이지 메뉴" width={50} height={50} />
        </Link>

        <Link href="/map" className={style.link}>
          <Image src={Map} alt="지도 보기 메뉴" width={30} height={30} />
          <span className={style.span}>지도보기</span>
        </Link>

        <Link href="/favorite" className={style.link}>
          <Image src={Scrap} alt="찜한공간 보기 메뉴" width={30} height={30} />
          <span className={style.span}>찜한 공간</span>
        </Link>

        <Link href="/addspace" className={style.link}>
          <Image src={Add} alt="공간등록 페이지 메뉴" width={30} height={30} />
          <span className={style.span}>공간 등록</span>
        </Link>

        <Link href="/mypage" className={style.link}>
          <Image src={mypage} alt="마이페이지 메뉴" width={30} height={30} />
          <span className={style.span}>마이페이지</span>
        </Link>
      </nav>
    </>
  );
};
export default Navigation;
