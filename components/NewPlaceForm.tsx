import styles from './NewPlaceForm.module.css';
import Postcode from 'react-daum-postcode';
import React, { useState, useRef } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import dayjs, { Dayjs } from 'dayjs';
import TimeSelector from './TimeSelector';
// import TimePicker from 'react-time-picker';
// import 'react-time-picker/dist/TimePicker.css';
// import 'react-clock/dist/Clock.css';
interface DayTime {
  open: Dayjs | null;
  close: Dayjs | null;
  isOpen: boolean;
}
const NewPlaceForm = () => {
  const [is24HoursOpen, setIs24HoursOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [openTime, setOpenTime] = useState<string | null>(null);
  const [closeTime, setCloseTime] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0'),
  );
  const minutes = Array.from({ length: 6 }, (_, i) =>
    (i * 10).toString().padStart(2, '0'),
  );
  const [businessHours, setBusinessHours] = useState<{
    [key: string]: DayTime;
  }>({
    monday: { open: null, close: null, isOpen: false },
    tuesday: { open: null, close: null, isOpen: false },
    wednesday: { open: null, close: null, isOpen: false },
    thursday: { open: null, close: null, isOpen: false },
    friday: { open: null, close: null, isOpen: false },
    saturday: { open: null, close: null, isOpen: false },
    sunday: { open: null, close: null, isOpen: false },
  });

  const handleTimeChange = (
    day: string,
    type: 'open' | 'close',
    timeType: 'hour' | 'minute',
    value: string,
  ) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [type]: value },
    }));
  };
  const handleAddressChange = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setAddress(fullAddress);
    setIsAddressModalOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      return;
    }

    const newFiles = Array.from(files);
    const newUrls = newFiles.map(file => URL.createObjectURL(file));

    setImages(prev => [...prev, ...newFiles]);
    setImageUrls(prev => [...prev, ...newUrls]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imageUrls[index]); // 메모리 해제
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length < 2) {
      alert('최소 2장 이상의 사진을 첨부해주세요.');
      return;
    }
    // ... 나머지 제출 로직
  };

  return (
    <div className={styles.newPlaceFormContainer}>
      <fieldset className={styles.spaceInfo}>
        <legend aria-label="공간정보"></legend>
        <label>공간이름</label>
        <input
          type="text"
          className={styles.spaceInfoInput}
          placeholder="업체 명칭을 입력해주세요"
        />
        <label>주소</label>
        <div className={styles.addressContainer}>
          <input
            type="text"
            className={styles.spaceInfoInput}
            placeholder="주소를 입력해주세요"
            value={address}
            readOnly
            onClick={() => setIsAddressModalOpen(true)}
          />
          <button
            type="button"
            className={styles.addressSearchBtn}
            onClick={() => setIsAddressModalOpen(true)}
            aria-label="주소 검색버튼"
          ></button>
        </div>

        {isAddressModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h3>주소 검색</h3>
                <button
                  onClick={() => setIsAddressModalOpen(false)}
                  className={styles.addressModalcloseBtn}
                >
                  ✕
                </button>
              </div>
              <Postcode
                onComplete={handleAddressChange}
                style={{ height: 400 }}
              />
            </div>
          </div>
        )}
        <label>전화 번호</label>
        <input
          type="text"
          className={styles.spaceInfoInput}
          placeholder="전화번호를 입력해주세요"
        />
        <label>운영시간</label>

        <div className={styles.timeSelectorContainer}>
          <input type="checkbox" placeholder="운영시간을 입력해주세요" />
          <label className={styles.timeSelectorLabel}>월요일</label>
          <TimeSelector />
        </div>
        <div className={styles.timeSelectorContainer}>
          <input type="checkbox" placeholder="운영시간을 입력해주세요" />
          <label className={styles.timeSelectorLabel}>화요일</label>
          <TimeSelector />
        </div>
        <div className={styles.timeSelectorContainer}>
          <input type="checkbox" placeholder="운영시간을 입력해주세요" />
          <label className={styles.timeSelectorLabel}>수요일</label>
          <TimeSelector />
        </div>
        <div className={styles.timeSelectorContainer}>
          <input type="checkbox" placeholder="운영시간을 입력해주세요" />
          <label className={styles.timeSelectorLabel}>목요일</label>
          <TimeSelector />
        </div>
        <div className={styles.timeSelectorContainer}>
          <input type="checkbox" placeholder="운영시간을 입력해주세요" />
          <label className={styles.timeSelectorLabel}>금요일</label>
          <TimeSelector />
        </div>
        <div className={styles.timeSelectorContainer}>
          <input type="checkbox" placeholder="운영시간을 입력해주세요" />
          <label className={styles.timeSelectorLabel}>토요일</label>
          <TimeSelector />
        </div>
        <div className={styles.timeSelectorContainer}>
          <input type="checkbox" placeholder="운영시간을 입력해주세요" />
          <label className={styles.timeSelectorLabel}>일요일</label>
          <TimeSelector />
        </div>
        <label>공간 사진</label>
        <div className={styles.imageUploadSection}>
          <div className={styles.imagePreviewContainer}>
            {imageUrls.map((url, index) => (
              <div key={url} className={styles.imagePreview}>
                <img src={url} alt={`공간 사진 ${index + 1}`} />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className={styles.removeImageBtn}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={styles.addImageBtn}
            >
              + 사진 추가
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            className={styles.hiddenInput}
          />
          <p className={styles.imageGuide}>
            * 최소 2장 이상의 사진을 첨부해주세요 ({images.length}장 선택됨)
          </p>
        </div>
      </fieldset>
      <div className={styles.selectContainer}>
        <div className={styles.buttonContainer}>
          <h5>업종구분</h5>
          <div>
            <button className={styles.selectBtn}>카페</button>
            <button className={styles.selectBtn}>기타공간</button>
          </div>
        </div>

        <h4>편의시설</h4>
        <div className={styles.buttonContainer}>
          <button className={styles.selectBtn}>주차가능</button>
          <button className={styles.selectBtn}>주차불가</button>
        </div>
        <h5>단체석 유무</h5>
        <div className={styles.buttonContainer}>
          <button className={styles.selectBtn}>단체석 있음</button>
          <button className={styles.selectBtn}>단체석 없음</button>
        </div>
      </div>
      {/* <button>등록하기</button>
      <button>취소하기</button> */}
    </div>
  );
};

export default NewPlaceForm;
