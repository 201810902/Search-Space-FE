import styles from './mypage.module.css';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';
import CafeDetail from './modals/CafeDetail';
import cafedata from '../../public/cafedata.json' assert { type: 'json' };
import EditProfile from './modals/EditProfile';
import userdata from '../../public/userdata.json' assert { type: 'json' };

interface DataItem {
  id: number;
  title: string;
  content: string;
  address: string;
  type: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  businessHours: string;
  holidays: string;
  url: string;
  copyright: boolean;
  approval: boolean;
  isOpen: boolean;
  images: string[];
}

export default function Mypage() {
  const router = useRouter();
  const { modal, id } = router.query;
  const openModal = (id: number) => {
    router.push(`/mypage?modal=cafe-detail&id=${id}`, undefined, {
      shallow: true,
    });
    console.log('modal open');
  };
  const closeModal = () => {
    router.push('/mypage'), undefined, { shallow: true };
    console.log('modal close');
  };

  const typedData = cafedata as unknown as DataItem[];
  console.log(typeof typedData);

  // const typeData = data.items as DataItem[];
  const [viewType, setViewType] = useState<'grid' | 'list'>('list');
  const [contentType, setContentType] = useState<'mySpace' | 'myReview'>(
    'mySpace',
  );
  const handleViewList = () => {
    setViewType('list');
  };
  const handleViewGrid = () => {
    setViewType('grid');
  };
  const handleMySpace = () => {
    setContentType('mySpace');
  };
  const handleMyReview = () => {
    setContentType('myReview');
  };

  return (
    <>
      <div className={styles.mypageContainer}>
        <div className={styles.profileContainer}>
          <div className={styles.profileImgContainer}>
            <button></button>
          </div>
          <div className={styles.profileInfoContainer}>
            <div className={styles.nickname}>nickname</div>
            <div>email@gmail.com</div>
            <button className={styles.editBtn}>회원정보 수정하기</button>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        {/* <h3>콘텐츠 렌더링할 자리</h3> */}
        <div className={styles.mypageMenu}>
          <div className={styles.mySpaceBtnContainer}>
            <button
              className={
                contentType == 'mySpace' ? styles.mySpaceBtn : styles.myContent
              }
              onClick={handleMySpace}
            >
              {' '}
              내가 등록한 공간
            </button>
            <button
              className={
                contentType == 'myReview'
                  ? styles.myReviewBtn
                  : styles.myContent
              }
              onClick={handleMyReview}
            >
              내 리뷰
            </button>
          </div>

          <div className={styles.sortBtnContainer}>
            <button
              className={
                viewType === 'list' ? styles.listViewOn : styles.listViewOff
              }
              onClick={handleViewList}
            ></button>
            <button
              className={
                viewType === 'grid' ? styles.gridViewOn : styles.gridViewOff
              }
              onClick={handleViewGrid}
            ></button>
          </div>
        </div>
        <div className={styles.contentContainer}>
          {typedData.map((item: DataItem) => (
            <div
              key={item.id}
              className={
                viewType === 'list'
                  ? styles.listViewContainer
                  : styles.gridViewContainer
              }
              onClick={() => openModal(item.id)}
            >
              <div
                className={
                  viewType === 'list'
                    ? styles.contentListItem
                    : styles.contentGridItem
                }
              >
                <h3>{item.title}</h3>
                {item.address}
                <div className={styles.contentItemImgContainer}>
                  {item.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt="contentImg"
                      width={100}
                      height={100}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <CafeDetail
          isOpen={modal === 'cafe-detail'}
          onClose={closeModal}
          cafeId={id ? Number(id) : undefined}
        />
      </div>
    </>
  );
}
