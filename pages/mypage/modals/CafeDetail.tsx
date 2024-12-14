import React from 'react';
import Modal from '@/components/Modal';
import data from '@/public/cafedata.json' assert { type: 'json' };
import styles from './CafeDetail.module.css';
import Image from 'next/image';
import Form from '@/components/NewPlaceForm';

interface CafeDetailProps {
  isOpen: boolean;
  onClose: () => void;
  cafeId: number | undefined;
}

const CafeDetail: React.FC<CafeDetailProps> = ({ isOpen, onClose, cafeId }) => {
  if (!cafeId)
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div>카페 정보를 찾을 수 없습니다.</div>
      </Modal>
    );
  const cafeData = data.find(item => item.id === cafeId);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {cafeData ? (
        <div className={styles.cafeDetailContainer}>
          <h2 className={styles.title}>{cafeData.title}</h2>
          {/* <span className={styles.address}>{cafeData.address}</span>
          <p>블라블라</p>
          <div className={styles.imagesContainer}>
            <p>내가 등록한 사진</p>
            {cafeData.images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt="cafeImg"
                width={100}
                height={100}
              />
            ))}
          </div> */}
          <Form />
        </div>
      ) : (
        <div>해당 카페의 데이터가 존재하지 않습니다.</div>
      )}
    </Modal>
  );
};

export default CafeDetail;
