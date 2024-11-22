import styles from './mypage.module.css';
import Image from 'next/image';
export default function Mypage() {
  return (
    <>
      <div className={styles.mypageContainer}>
        <div className={styles.profileContainer}>
          <div className={styles.profileImgContainer}></div>
          <div className={styles.profileInfoContainer}>
            <div className={styles.nickname}>nickname</div>
            <div>email@gmail.com</div>
            <button className={styles.editBtn}>회원정보 수정하기</button>
          </div>
        </div>
        <div className={styles.mySpaceAndReviewContainer}>
          <div className={styles.mySpaceBtnContainer}>
            <button className={styles.mySpaceBtn}>
              {/* <Image
                src="@/public/myspace.png"
                alt="myspaceBtn"
                width={100}
                height={100}
              />{' '} */}
            </button>
            <span>내가 등록한 공간</span>
          </div>
          <div className={styles.mySpaceBtnContainer}>
            <button className={styles.myReviewBtn}>
              {/* <Image
                src="@/public/myspace.png"
                alt="myspaceBtn"
                width={100}
                height={100}
              />{' '} */}
            </button>
            <span>내 리뷰</span>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <h3>콘텐츠 렌더링할 자리</h3> 근데 마이페이지 따로 뺴면 ui 어떻게
        수정하면 좋지
      </div>
    </>
  );
}
